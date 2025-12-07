"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client'; // Make sure this path matches your project

// Type definitions
interface Prediction {
  common_name: string;
  scientific_name: string;
  confidence?: number;
  danger_level: string;
  status: string;
  conservation_status: string;
  wiki_summary?: string;
  wiki_link?: string;
  wiki_image?: string;
  inat_taxon_id?: number | null;
  inat_url?: string | null;
  inat_default_photo?: string | null;
  inat_observations?: number | null;
  inat_conservation_status?: string | null;
  inat_preferred_common_name?: string | null;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  image?: string;
  predictions?: Prediction[];
  timestamp: Date;
  sessionId?: string;
}

export const AiChatLoggedIn = (): React.ReactElement => {
  const [messages, setMessages] = useState<Message[]>([]); // Current chat messages
  const [chatHistory, setChatHistory] = useState<Message[]>([]); // All saved history
  const [currentSessionId, setCurrentSessionId] = useState<string>(Date.now().toString()); // Current chat session
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalPred, setModalPred] = useState<Prediction | null>(null);
  const [modalTab, setModalTab] = useState<'wiki' | 'inat'>('wiki');
  const [showCamera, setShowCamera] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showMainContent, setShowMainContent] = useState(true);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState<Message | null>(null);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --- 1. LOAD USER PROFILE AND HISTORY ON STARTUP ---
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUsernameLoading(false);
        return;
      }

      // Set email
      setEmail(user.email || null);

      // Fetch user profile for username
      console.log('Fetching username for user_id:', user.id);
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching username:', profileError);
      }

      console.log('Profile data:', profile);
      
      if (profile?.username) {
        console.log('Setting username to:', profile.username);
        setUsername(profile.username);
      } else {
        console.warn('No username found in profile');
      }
      setUsernameLoading(false);

      // Fetch chat history
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        const historyMessages: Message[] = data.map((item) => ({
          id: item.id,
          type: item.role === 'user' ? 'user' : 'assistant',
          content: item.content || "",
          image: item.image_url || undefined,
          predictions: item.predictions as Prediction[],
          timestamp: new Date(item.created_at),
          sessionId: item.id // Use id as session for now
        }));
        setChatHistory(historyMessages); // Store in history only
        // Don't auto-load into current chat - keep it clean for new session
      }
    };
    fetchUserData();
  }, []);

  // --- 2. HELPER: UPLOAD IMAGE TO SUPABASE ---
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data } = supabase.storage.from('chat-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Upload function error:', error);
      return null;
    }
  };

  // --- 3. HELPER: SAVE CHAT TO DATABASE ---
  const saveToHistory = async (role: 'user' | 'assistant', content: string, predictions: Prediction[] | null, imageUrl?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('chat_history').insert({
      user_id: user.id,
      role: role,
      content: content,
      predictions: predictions,
      image_url: imageUrl || null
      // Note: session_id column doesn't exist yet - will be added in migration
    });
  };

  // Auto-scroll logic
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG or PNG)");
      return;
    }

    const preview = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(preview);
    
    if (showCamera) closeCamera();
    
    setTimeout(() => {
      handleIdentifyImageAuto(file, preview);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 100);
  };

  const openCamera = async () => {
    setIsCameraLoading(true);
    setShowCamera(true);
    setShowMainContent(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 } 
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
            setIsCameraLoading(false);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
      setIsCameraLoading(false);
      setShowCamera(false);
      setShowMainContent(true);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", {
            type: "image/jpeg",
          });
          const preview = URL.createObjectURL(file);
          setSelectedFile(file);
          setPreviewUrl(preview);
          closeCamera();

          setTimeout(() => {
            handleIdentifyImageAuto(file, preview);
            setSelectedFile(null);
            setPreviewUrl(null);
          }, 100);
        }
      }, "image/jpeg");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setShowMainContent(true);
    setIsCameraLoading(false);
  };

  // --- UPDATED IDENTIFY FUNCTION ---
  const handleIdentifyImageAuto = async (file: File, preview: string) => {
    setIsLoading(true);

    // 1. Upload to Supabase Storage first
    const publicUrl = await uploadImage(file);
    const displayImage = publicUrl || preview; // Use the permanent URL if upload succeeds

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: "Please identify this species",
      image: displayImage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Save User Message to DB
    saveToHistory('user', "Please identify this species", null, displayImage);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to identify species");
      }

      const data = await response.json();
      const predictionCount = data.predictions?.length || 0;
      let responseText = "";

      if (predictionCount === 0) {
        responseText = "I couldn't confidently identify any species from this image. Please try a clearer photo.";
      } else if (predictionCount === 1) {
        responseText = "I've analyzed the image — this species is *very likely* to be:";
      } else {
        responseText = "I've analyzed the image. Here are the top 3 possible species:";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: responseText,
        predictions: data.predictions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save Assistant Response to DB
      saveToHistory('assistant', responseText, data.predictions);

    } catch (error) {
      console.error("Error identifying image:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error while identifying the species. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // --- UPDATED SEND MESSAGE FUNCTION ---
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Save text to history
    saveToHistory('user', currentInput, null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const reply = data.reply || "Sorry, I couldn't generate a response.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant text to history
      saveToHistory('assistant', reply, null);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div 
      className={`w-full h-screen relative overflow-hidden flex items-center justify-center transition-colors duration-300 
      ${isDarkMode ? 'bg-[#292d29]' : 'bg-[#f1eee5]'}`}
    >
      <div
        className="relative"
        style={{
          width: "1440px",
          height: "656px",
          transform: "scale(var(--scale))",
          transformOrigin: "center",
        }}
      >
        <style>{`
          :root {
            --scale: calc(min(100vw / 1440, 100vh / 656));
          }
        `}</style>

        {/* Header Bar */}
        <div className="fixed top-0 left-0 right-0 w-full z-50">
          <div className={`w-full h-11 justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#353b35]' : 'bg-[#dad2b9]'}`} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1440px] max-w-full h-11">
            <div className="absolute -top-0.5 left-[46px] [-webkit-text-stroke:0.5px_#072d0d] bg-[linear-gradient(180deg,rgba(149,171,51,1)_30%,rgba(35,115,47,1)_57%,rgba(8,46,13,1)_83%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins-ExtraBold',Helvetica] font-extrabold text-transparent text-[32px] tracking-[1.60px] leading-[normal]">
              SPOT
            </div>
            
            {/* Header Deco Lines */}
            <div className="absolute top-5 left-[-15px] w-[46px] h-[7px] bg-[#f1eee5]" />
            <div className="absolute top-[15px] left-[-12px] w-10 h-[5px] bg-[#f1eee5]" />
            <div className="absolute top-[27px] left-[-12px] w-10 h-[3px] bg-[#f1eee5]" />
            <div className="top-[26px] absolute left-[-8px] w-[30px] h-[9px] bg-[#f1eee5] rounded-[15px/4.5px]" />
            <div className="top-2.5 absolute left-[-8px] w-[30px] h-[9px] bg-[#f1eee5] rounded-[15px/4.5px]" />
            
            <img className="absolute top-0 left-[-32px] w-[75px] h-[47px] aspect-[1.48] object-cover" alt="Spoticon" src="/spicon0.svg" />

            {/* DARK MODE TOGGLE */}
            <img 
              className="absolute top-1.5 left-[1340px] w-[47px] h-[31px] aspect-[1.51] cursor-pointer hover:opacity-80 transition-opacity" 
              alt="Element" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              src={isDarkMode ? "/dark-mode 1.svg" : "/6ae923df-a01f-4168-9d3a-9f0563de2a4d-removebg-preview 2.svg"} 
            />

            {/* Profile button */}
            <div className="absolute top-[5px] left-[1406px]">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              >
                <img className="w-[35px] h-[35px] aspect-[1] object-cover" alt="Down chevron" src="/down-chevron 1.svg" />
                <img className="w-[35px] h-[35px] aspect-[1] object-cover rounded-full" alt="User" src="/user (2) 9.svg" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50" style={{ border: '2px solid #899A3C' }} onMouseDown={(e) => e.preventDefault()}>
                  <div className="px-4 py-3 border-b border-gray-300">
                    <h3 className="text-base font-bold text-gray-900">@{username || (usernameLoading ? 'loading...' : 'explorer')}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{email || 'loading...'}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5" onClick={() => { }}>
                      <span className="text-sm font-medium text-gray-900">View Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-[#DBE9AF] transition-colors flex items-center gap-2.5" onClick={() => { }}>
                      <span className="text-sm font-medium text-gray-900">Account Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-400">
                    <button className="w-full px-4 py-2 text-left hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2.5 group" onClick={async () => {
                      try {
                        const { error } = await supabase.auth.signOut();
                        if (error) console.error('Error signing out:', error.message);
                      } catch (err) {
                        console.error('Sign out failed:', err);
                      }
                      try { router.push('/'); } finally { window.location.href = '/'; }
                    }}>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-white">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Content Area Background */}
        <div className={`absolute top-[-12] left-[424px] w-[592px] h-[750px] bg-[linear-gradient(180deg,rgba(208,230,144,0.73)_0%,rgba(58,84,42,0.76)_100%)] pointer-events-none transition-opacity duration-300 ${isDarkMode ? 'opacity-20' : 'opacity-100'}`} />

        {/* Right Chat Panel */}
        <div 
          className={`absolute top-[27px] left-[1040px] w-[420px] h-[645px] rounded-[25px] border border-solid overflow-hidden transition-colors duration-300
          ${isDarkMode 
            ? 'bg-[#3b423b] border-gray-600' 
            : 'bg-[#d0e58f1f] border-black'}`}
        >
          <div
            ref={chatContainerRef}
            className={`absolute top-4 left-4 right-4 bottom-20 overflow-y-auto overscroll-contain ${isDarkMode ? 'dark-scrollbar' : ''}`}
          >
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.type === "user" ? "text-right" : "text-left"}`}>
                <div 
                  className={`inline-block max-w-[85%] rounded-2xl p-3 
                  ${message.type === "user" 
                    ? "bg-[#95ab33] text-white" 
                    : isDarkMode 
                      ? "bg-[#4a524a] text-white" 
                      : "bg-white text-black"
                  }`}
                >
                  {message.image && (
                    <img src={message.image} alt="Uploaded" className="w-full rounded-lg mb-2 max-h-[200px] object-cover" />
                  )}
                  <p className="text-sm">{message.content}</p>
                  {message.predictions && (
                    <div className="mt-3 space-y-3 text-left">
                      {message.predictions.map((pred, idx) => (
                        <div key={idx} className={`border-t pt-2 ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-base">{pred.common_name}</h3>
                              <p className={`text-xs italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{pred.scientific_name}</p>
                            </div>
                            {pred.confidence !== undefined && (
                              <div className="text-sm font-semibold">{pred.confidence}%</div>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="text-xs bg-yellow-100 text-black px-2 py-0.5 rounded">{pred.danger_level}</span>
                            <span className="text-xs bg-blue-100 text-black px-2 py-0.5 rounded">{pred.status}</span>
                            <span className="text-xs bg-green-100 text-black px-2 py-0.5 rounded">{pred.conservation_status}</span>
                          </div>
                          {pred.wiki_summary && <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{pred.wiki_summary}</p>}
                          {pred.wiki_link && (
                            <button onClick={() => { setModalPred(pred); setModalTab('wiki'); }} className="text-xs text-blue-400 underline mt-1 inline-block">Learn more →</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-left mb-4">
                <div className={`inline-block rounded-2xl p-3 ${isDarkMode ? 'bg-[#4a524a] text-white' : 'bg-white'}`}>
                  <p className="text-sm italic">{selectedFile ? "Identifying species..." : "Thinking..."}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Wikipedia / iNaturalist details */}
        {modalPred && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setModalPred(null)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-[94%] mx-4 p-4 z-60 overflow-auto max-h-[80vh]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{modalPred.common_name || modalPred.scientific_name}</h3>
                  {modalPred.scientific_name && <p className="text-xs italic text-gray-600">{modalPred.scientific_name}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-md bg-gray-100 p-1">
                    <button onClick={() => setModalTab('wiki')} className={`px-3 py-1 rounded ${modalTab === 'wiki' ? 'bg-white shadow' : 'text-gray-600'}`}>Wikipedia</button>
                    <button onClick={() => setModalTab('inat')} className={`px-3 py-1 rounded ${modalTab === 'inat' ? 'bg-white shadow' : 'text-gray-600'}`}>iNaturalist</button>
                  </div>
                  <button onClick={() => setModalPred(null)} className="text-gray-500 hover:text-gray-800">✕</button>
                </div>
              </div>

              <div className="mt-4">
                {modalTab === 'wiki' ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    {modalPred.wiki_image ? (
                      <img src={modalPred.wiki_image} alt={modalPred.common_name || modalPred.scientific_name || 'Image'} className="w-full md:w-48 h-auto object-cover rounded" />
                    ) : null}
                    <div className="flex-1">
                      {modalPred.wiki_summary ? (
                        <p className="text-sm text-gray-700 whitespace-pre-line">{modalPred.wiki_summary}</p>
                      ) : (
                        <p className="text-sm text-gray-600">No additional information available.</p>
                      )}
                      {modalPred.wiki_link && (
                        <div className="mt-4"><a href={modalPred.wiki_link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Open on Wikipedia</a></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {modalPred.inat_default_photo ? (
                      <img src={modalPred.inat_default_photo} alt={modalPred.inat_preferred_common_name || modalPred.scientific_name || 'iNaturalist image'} className="w-full md:w-48 h-auto object-cover rounded" />
                    ) : (
                      <div className="w-full md:w-48 h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500">No image</div>
                    )}

                    <div>
                      {modalPred.inat_preferred_common_name && <p className="text-sm font-semibold">{modalPred.inat_preferred_common_name}</p>}
                      <p className="text-xs italic text-gray-600">Observations: {modalPred.inat_observations ?? '—'}</p>
                      {modalPred.inat_conservation_status && <p className="text-xs text-red-600">Conservation: {modalPred.inat_conservation_status}</p>}
                      {modalPred.inat_url && (
                        <div className="mt-2"><a href={modalPred.inat_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Open on iNaturalist</a></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat History Toggle Button */}
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className={`absolute top-[120px] left-[20px] w-[200px] font-extrabold text-xl tracking-[1.00px] leading-[normal] cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 ${isDarkMode ? 'text-[#dad2b9]' : 'text-[#4d4d4d]'}`}
        >
          Chat History
          <span className={`text-sm transition-transform ${isHistoryOpen ? 'rotate-90' : ''}`}>▶</span>
        </button>

        {/* New Chat Button */}
        <button
          onClick={async () => {
            setMessages([]); // Clear current chat
            setCurrentSessionId(Date.now().toString()); // Create new session
            setShowMainContent(true);
            setInputValue('');
            // Don't close history dropdown
            
            // Refresh history from database
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data } = await supabase
                .from('chat_history')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });
              
              if (data) {
                const historyMessages: Message[] = data.map((item) => ({
                  id: item.id,
                  type: item.role === 'user' ? 'user' : 'assistant',
                  content: item.content || "",
                  image: item.image_url || undefined,
                  predictions: item.predictions as Prediction[],
                  timestamp: new Date(item.created_at),
                  sessionId: item.id
                }));
                setChatHistory(historyMessages);
              }
            }
          }}
          className={`absolute top-[120px] left-[235px] w-[135px] h-[35px] rounded-[20px] font-semibold text-sm cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-[#95ab33] text-[#292d29]' : 'bg-[#95ab33] text-white'}`}
        >
          <span className="text-lg">+</span>
          New Chat
        </button>

        {/* Left Chat History Panel - Static Background */}
        <div 
          className={`absolute top-[160px] left-[-15] w-[410px] h-[440px] rounded-[25px] border border-solid transition-all duration-300
          ${isDarkMode 
            ? 'bg-[#3b423b] border-gray-600' 
            : 'bg-[#d0e58f1f] border-black'}`}
        >
          {isHistoryOpen ? (
            <div className="p-4 h-full overflow-y-auto">
              {chatHistory.length > 0 ? (
                <div className="space-y-2">
                  {/* Group messages by session and show only first user message per session */}
                  {(() => {
                    const sessionMap = new Map<string, Message>();
                    chatHistory.filter(m => m.type === 'user').forEach(msg => {
                      const sessId = msg.sessionId || msg.id;
                      if (!sessionMap.has(sessId)) {
                        sessionMap.set(sessId, msg);
                      }
                    });
                    
                    return Array.from(sessionMap.values()).reverse().map((msg) => {
                      // Find the assistant response right after this user message
                      const msgIndex = chatHistory.findIndex(m => m.id === msg.id);
                      const assistantResponse = chatHistory
                        .slice(msgIndex + 1)
                        .find(m => m.type === 'assistant' && m.predictions && m.predictions.length > 0);
                      const firstSpecies = assistantResponse?.predictions?.[0]?.common_name;
                      // Prioritize species name, then fall back to 'Image identification'
                      const displayTitle = firstSpecies || 'Image identification';
                      const sessId = msg.sessionId || msg.id;
                      
                      return (
                        <div 
                          key={msg.id}
                          onClick={() => {
                            // Load all messages near this one (within 5 minutes = rough session)
                            const msgTime = msg.timestamp.getTime();
                            const sessionMsgs = chatHistory.filter(m => {
                              const diff = Math.abs(m.timestamp.getTime() - msgTime);
                              return diff < 5 * 60 * 1000; // 5 minutes window
                            });
                            setMessages(sessionMsgs);
                            setCurrentSessionId(sessId);
                          }}
                          className={`p-3 rounded-lg cursor-pointer hover:opacity-80 transition flex items-center gap-3 relative ${
                            isDarkMode ? 'bg-[#4a524a]' : 'bg-white'
                          } ${currentSessionId === sessId ? 'ring-2 ring-[#95ab33]' : ''}`}
                        >
                          {msg.image && (
                            <img 
                              src={msg.image} 
                              alt="Chat" 
                              className="w-12 h-12 rounded-md object-cover flex-shrink-0" 
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {displayTitle}
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {msg.timestamp.toLocaleDateString()} {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmMsg(msg);
                            }}
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition text-xl font-bold ${isDarkMode ? 'text-gray-400 bg-gray-600' : 'text-gray-600 bg-gray-200'}`}
                          >
                            ×
                          </button>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <p className={`text-sm text-center mt-20 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No chat history yet. Start a conversation!
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Click "Chat History" to view past conversations
              </p>
            </div>
          )}
        </div>

        {/* Chat Input Box */}
        <div 
          className={`absolute top-[589px] left-[1055px] w-[390px] h-[65px] rounded-[25px] border border-solid border-[#95ab33] transition-colors duration-300
          ${isDarkMode ? 'bg-[#00000033]' : 'bg-[#ffffff33]'}`}
        >
          {previewUrl && (
            <div className="absolute -top-16 left-4 right-4">
              <div className="relative inline-block">
                <img src={previewUrl} alt="Preview" className="h-14 rounded-lg object-cover" />
                <button onClick={clearSelectedFile} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">×</button>
              </div>
            </div>
          )}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask Anything"
            disabled={isLoading}
            className={`absolute top-[18px] left-[30px] w-[250px] bg-transparent outline-none font-normal italic text-[15px] tracking-[0.75px] leading-[normal] 
              ${isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-[#111311] placeholder:text-[#111311]'}`}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSendMessage();
            }}
            disabled={isLoading || !inputValue.trim()}
            className="absolute top-[15px] right-[12px] w-[35px] h-[35px] bg-[#95ab33] rounded-full flex items-center justify-center hover:bg-[#7a8f2a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-white text-lg">→</span>
          </button>
        </div>

        <img
          className="absolute top-[605px] left-[1360px] w-[34px] h-[34px] aspect-[1] object-cover cursor-pointer hover:opacity-80"
          alt="Gallery"
          src="/gall.svg"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        />

        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileSelect} className="hidden" />

        {/* Main Center Content Area - ALWAYS VISIBLE EXCEPT WHEN CAMERA IS ACTIVE */}
        {!showCamera && (
          <div 
            className={`absolute top-[25px] left-[444px] w-[552px] h-[650px] rounded-[76px] border border-dashed overflow-hidden z-10 flex flex-col items-center justify-center transition-colors duration-300
            ${isDarkMode 
              ? 'bg-[#6d8a6d] border-[#dad2b9]' 
              : 'bg-[#d9d9d95c] border-[#140e0e]'}`}
          >
            <img className="absolute top-[78px] left-[203px] w-[146px] h-[146px] aspect-[1] object-cover" alt="Binoculars" src="/bin.svg" />
            <div className="absolute top-[205px] left-[122px] w-[305px] font-extrabold text-black text-2xl tracking-[1.20px] leading-[normal] text-center">Spotted Anything?</div>

            {/* Open Camera Button */}
            <div className="absolute top-[380px] left-[120px] w-[327px] h-[60px] cursor-pointer hover:opacity-90 hover:scale-105 transition-all duration-200" onClick={openCamera}>
              <div className="absolute top-0 left-0 w-[327px] h-[60px] bg-white rounded-[29px] shadow-lg" />
              <div className="absolute top-[15px] left-[110px] w-[251px] font-semibold text-black text-xl tracking-[1.00px] leading-[normal]">Open Camera</div>
              <img className="absolute top-2.5 left-14 w-[38px] h-[38px] aspect-[1] object-cover" alt="Cam" src="/cam.svg" />
            </div>

            {/* Upload Photo Button */}
            <div className="absolute top-[475px] left-[120px] w-[329px] h-[60px] cursor-pointer hover:opacity-90 hover:scale-105 transition-all duration-200" onClick={() => fileInputRef.current?.click()}>
              <div className="absolute top-0 left-0 w-[327px] h-[60px] bg-white rounded-[29px] shadow-lg" />
              <div className="absolute top-[15px] left-[68px] w-[178px] font-semibold text-black text-xl tracking-[1.00px] leading-[normal]">Upload Photo</div>
              <img className="absolute top-2.5 left-[227px] w-[37px] h-[38px] aspect-[1] object-cover" alt="Pic" src="/pic.svg" />
            </div>
          </div>
        )}

        {/* Active Camera View */}
        {showCamera && (
          <div className={`absolute top-[25px] left-[444px] w-[552px] h-[650px] rounded-[76px] overflow-hidden z-20 bg-black`}>
            {isCameraLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="font-semibold tracking-wider text-sm">STARTING CAMERA...</p>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {!isCameraLoading && (
              <div className="absolute inset-0 z-10 flex flex-col justify-end pb-12">
                <div className="flex items-center justify-center gap-8 px-8">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition border border-white/30 shadow-lg"
                  >
                    <img src="/pic.svg" alt="Upload" className="w-6 h-6 object-contain" />
                  </button>

                  <button onClick={capturePhoto} className="group relative w-20 h-20 rounded-full border-4 border-white bg-transparent flex items-center justify-center hover:scale-105 transition-transform shadow-xl mx-2">
                    <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform" />
                  </button>

                  <button onClick={closeCamera} className="w-14 h-14 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-600 transition shadow-lg border border-red-400/50">
                    <span className="text-2xl font-bold mb-0.5">×</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Icons & Footer Info */}
        <img className="top-[640px] left-[-10px] w-[30px] h-[30px] absolute aspect-[1] object-cover" alt="User" src="/user (2) 6.svg" />
        <div className={`absolute top-[643px] left-[35px] w-[156px] font-black text-base tracking-[0.80px] leading-[normal] ${isDarkMode ? 'text-[#a0c563]' : 'text-[#072d0d]'}`}>
          @{username || (usernameLoading ? 'loading...' : 'explorer')}
        </div>

        {/* Back Button */}
        <div className="absolute top-[25px] left-[-15px] w-[104px] h-[30px] cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-200" onClick={() => router.back()}>
          <div className={`absolute top-0 left-0 w-[104px] h-[30px] rounded-[43px] hover:opacity-80 transition ${isDarkMode ? 'bg-[#95ab33]' : 'bg-[#d0e58fb2]'}`} />
          <img className="absolute top-[6.5px] left-[16px] w-[17px] h-[17px] aspect-[1] object-cover" alt="Back" src="/back.svg" />
          <div className={`absolute top-[3px] left-[42px] w-[47px] font-bold text-base tracking-[0] leading-[normal] ${isDarkMode ? 'text-[#292d29]' : 'text-[#072d0db0]'}`}>
            back
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmMsg && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirmMsg(null)} />
            <div 
              className="relative rounded-2xl shadow-2xl w-[400px] p-6 z-[201]"
              style={{ 
                background: isDarkMode ? '#3b423b' : '#f1eee5',
                border: '2px solid #899A3C'
              }}
            >
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-[#dad2b9]' : 'text-[#072d0d]'}`}>
                Delete Conversation?
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This will permanently delete this conversation and cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmMsg(null)}
                  className={`px-6 py-2 rounded-full font-semibold transition hover:opacity-80 ${
                    isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const msg = deleteConfirmMsg;
                    setDeleteConfirmMsg(null);
                    
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      try {
                        // Find all messages in this conversation (within 5 min window)
                        const msgTime = msg.timestamp.getTime();
                        const conversationMsgs = chatHistory.filter(m => {
                          const diff = Math.abs(m.timestamp.getTime() - msgTime);
                          return diff < 5 * 60 * 1000;
                        });
                        
                        console.log('Attempting to delete messages:', conversationMsgs.map(m => ({ id: m.id, type: m.type })));
                        
                        // Delete each message individually to avoid query issues
                        let deletedCount = 0;
                        for (const message of conversationMsgs) {
                          const { error, count } = await supabase
                            .from('chat_history')
                            .delete()
                            .eq('id', message.id)
                            .eq('user_id', user.id);
                          
                          if (error) {
                            console.error('Delete error for message:', message.id, error);
                            alert(`Failed to delete message: ${error.message}`);
                            return;
                          } else {
                            deletedCount++;
                            console.log('Successfully deleted message:', message.id);
                          }
                        }
                        
                        console.log(`Successfully deleted ${deletedCount} messages`);
                        
                        // Refresh history
                        const { data } = await supabase
                          .from('chat_history')
                          .select('*')
                          .eq('user_id', user.id)
                          .order('created_at', { ascending: true });
                        
                        if (data) {
                          const historyMessages: Message[] = data.map((item) => ({
                            id: item.id,
                            type: item.role === 'user' ? 'user' : 'assistant',
                            content: item.content || "",
                            image: item.image_url || undefined,
                            predictions: item.predictions as Prediction[],
                            timestamp: new Date(item.created_at),
                          sessionId: item.id
                        }));
                        setChatHistory(historyMessages);
                      }
                      
                      // Clear current messages if any were deleted
                      if (conversationMsgs.some(m => messages.some(msg => msg.id === m.id))) {
                        setMessages([]);
                        setCurrentSessionId(Date.now().toString());
                      }
                    } catch (error) {
                      console.error('Failed to delete conversation:', error);
                      alert('Failed to delete conversation. Please try again.');
                    }
                  }
                  }}
                  className="px-6 py-2 rounded-full font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};