"use client";

import React, { useState, useRef, useEffect } from "react";

// Type definitions
interface Prediction {
  common_name: string;
  scientific_name: string;
  danger_level: string;
  status: string;
  conservation_status: string;
  wiki_summary?: string;
  wiki_link?: string;
  wiki_image?: string;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  image?: string;
  predictions?: Prediction[];
  timestamp: Date;
}

export const AiChatLoggedIn = (): React.ReactElement => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showMainContent, setShowMainContent] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG or PNG)");
      return;
    }

    const preview = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(preview);
    setShowMainContent(false);

    // Automatically send the image for identification
    setTimeout(() => {
      handleIdentifyImageAuto(file, preview);
    }, 100);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setShowCamera(true);
      setShowMainContent(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
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
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          const preview = URL.createObjectURL(file);
          setSelectedFile(file);
          setPreviewUrl(preview);
          closeCamera();
          
          // Automatically send captured photo
          setTimeout(() => {
            handleIdentifyImageAuto(file, preview);
          }, 100);
        }
      }, "image/jpeg");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setShowMainContent(true);
  };

  const handleIdentifyImageAuto = async (file: File, preview: string) => {
    setIsLoading(true);

    // Add user message with image
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: "Please identify this species",
      image: preview,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

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

      // Determine message based on prediction count
      const predictionCount = data.predictions?.length || 0;
      let responseText = "";

      if (predictionCount === 0) {
        responseText = "I couldn't confidently identify any species from this image. Please try a clearer photo.";
      } else if (predictionCount === 1) {
        responseText = "I've analyzed the image — this species is **very likely** to be:";
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

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error identifying image:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error while identifying the species. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowMainContent(true);
    }
  };

  const handleSendMessage = async () => {
    // Only process if there's text input
    if (!inputValue.trim()) return;

    // Text-only message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.reply || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
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
    setShowMainContent(true);
  };

  return (
    <div className="bg-[#f1eee5] overflow-hidden w-full min-w-[1440px] min-h-[656px] relative">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 w-[1440px] h-11 bg-[#dad2b9]" />

      {/* SPOT Logo Text */}
      <div className="absolute -top-0.5 left-[78px] [text-shadow:0px_4px_4px_#00000040] [-webkit-text-stroke:0.5px_#072d0d] bg-[linear-gradient(180deg,rgba(149,171,51,1)_30%,rgba(35,115,47,1)_57%,rgba(8,46,13,1)_83%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins-ExtraBold',Helvetica] font-extrabold text-transparent text-[32px] tracking-[1.60px] leading-[normal]">
        SPOT
      </div>

      {/* Logo decorative elements */}
      <div className="absolute top-5 left-[17px] w-[46px] h-[7px] bg-[#f1eee5]" />
      <div className="absolute top-[15px] left-5 w-10 h-[5px] bg-[#f1eee5]" />
      <div className="absolute top-[27px] left-5 w-10 h-[3px] bg-[#f1eee5]" />
      <div className="top-[26px] absolute left-6 w-[30px] h-[9px] bg-[#f1eee5] rounded-[15px/4.5px]" />
      <div className="top-2.5 absolute left-6 w-[30px] h-[9px] bg-[#f1eee5] rounded-[15px/4.5px]" />

      {/* Logo Icon */}
      <img
        className="absolute top-0 left-1 w-[75px] h-[47px] aspect-[1.48] object-cover"
        alt="Spoticon"
        src="/spoticon.svg"
      />

      {/* Center Content Area */}
      <div className="absolute top-11 left-[424px] w-[592px] h-[622px] bg-[linear-gradient(180deg,rgba(208,230,144,0.73)_0%,rgba(58,84,42,0.76)_100%)]" />

      {/* Header User Icons */}
      <img
        className="absolute top-[5px] left-[1358px] w-[35px] h-[35px] aspect-[1] object-cover"
        alt="Down chevron"
        src="/down-chevron 1.svg"
      />

      {/* Right Chat Panel */}
      <div className="absolute top-[61px] left-[1026px] w-[405px] h-[586px] bg-[#d0e58f1f] rounded-[25px] border border-solid border-black overflow-hidden">
        {/* Chat Messages Area */}
        <div className="absolute top-4 left-4 right-4 bottom-20 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.type === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block max-w-[85%] rounded-2xl p-3 ${
                  message.type === "user"
                    ? "bg-[#95ab33] text-white"
                    : "bg-white text-black"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="w-full rounded-lg mb-2 max-h-[200px] object-cover"
                  />
                )}
                <p className="text-sm [font-family:'Poppins',Helvetica]">{message.content}</p>
                
                {message.predictions && (
                  <div className="mt-3 space-y-3 text-left">
                    {message.predictions.map((pred, idx) => (
                      <div key={idx} className="border-t pt-2">
                        <h3 className="font-bold text-base [font-family:'Poppins-Bold',Helvetica]">{pred.common_name}</h3>
                        <p className="text-xs italic text-gray-600 [font-family:'Poppins-Italic',Helvetica]">{pred.scientific_name}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="text-xs bg-yellow-100 px-2 py-0.5 rounded [font-family:'Poppins',Helvetica]">
                            {pred.danger_level}
                          </span>
                          <span className="text-xs bg-blue-100 px-2 py-0.5 rounded [font-family:'Poppins',Helvetica]">
                            {pred.status}
                          </span>
                          <span className="text-xs bg-green-100 px-2 py-0.5 rounded [font-family:'Poppins',Helvetica]">
                            {pred.conservation_status}
                          </span>
                        </div>
                        {pred.wiki_summary && (
                          <p className="text-xs mt-2 text-gray-700 [font-family:'Poppins',Helvetica]">{pred.wiki_summary}</p>
                        )}
                        {pred.wiki_link && (
                          <a
                            href={pred.wiki_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline mt-1 inline-block [font-family:'Poppins',Helvetica]"
                          >
                            Learn more →
                          </a>
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
              <div className="inline-block bg-white rounded-2xl p-3">
                <p className="text-sm [font-family:'Poppins-Italic',Helvetica] italic">
                  {selectedFile ? "Identifying species..." : "Thinking..."}
                </p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Left Chat History Panel */}
      <div className="absolute top-[143px] left-6 w-[372px] h-[447px] bg-[#d0e58f1f] rounded-[25px] border border-solid border-black" />

      {/* Chat Input Box */}
      <div className="absolute top-[571px] left-[1038px] w-[381px] h-[65px] bg-[#ffffff33] rounded-[25px] border border-solid border-[#95ab33]">
        {/* File Preview in Input */}
        {previewUrl && (
          <div className="absolute -top-16 left-4 right-4">
            <div className="relative inline-block">
              <img src={previewUrl} alt="Preview" className="h-14 rounded-lg object-cover" />
              <button
                onClick={clearSelectedFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
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
          className="absolute top-[18px] left-[61px] w-[250px] bg-transparent outline-none [font-family:'Poppins-Italic',Helvetica] font-normal italic text-[#111311] text-[15px] tracking-[0.75px] leading-[normal] placeholder:text-[#111311]"
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
        className="absolute top-[587px] left-[1371px] w-[34px] h-[34px] aspect-[1] object-cover cursor-pointer hover:opacity-80"
        alt="Gallery"
        src="/gallery 2.svg"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Username */}
      <div className="absolute top-[619px] left-[49px] w-[156px] [font-family:'Poppins-Black',Helvetica] font-black text-[#072d0d] text-base tracking-[0.80px] leading-[normal]">
        @username
      </div>

      {/* Main Center Content Area with Border */}
      <div className="absolute top-[60px] left-[444px] w-[552px] h-[577px] bg-[#d9d9d95c] rounded-[76px] border border-dashed border-[#140e0e] overflow-hidden">
        {showMainContent && !showCamera && (
          <>
            <img
              className="absolute top-[78px] left-[203px] w-[146px] h-[146px] aspect-[1] object-cover"
              alt="Binoculars"
              src="/binoculars.svg"
            />

            <div className="absolute top-[205px] left-[122px] w-[305px] [font-family:'Poppins-ExtraBold',Helvetica] font-extrabold text-black text-2xl tracking-[1.20px] leading-[normal] text-center">
              Spotted Anything?
            </div>

            {/* Open Camera Button */}
            <div 
              className="absolute top-[337px] left-[120px] w-[327px] h-[60px] cursor-pointer hover:opacity-90 transition"
              onClick={openCamera}
            >
              <div className="absolute top-0 left-0 w-[327px] h-[60px] bg-white rounded-[29px] shadow-lg" />
              <div className="absolute top-[15px] left-[110px] w-[251px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-black text-xl tracking-[1.00px] leading-[normal]">
                Open Camera
              </div>
              <img
                className="absolute top-2.5 left-14 w-[38px] h-[38px] aspect-[1] object-cover"
                alt="Cam"
                src="/cam.svg"
              />
            </div>

            {/* Upload Photo Button */}
            <div 
              className="absolute top-[436px] left-[120px] w-[329px] h-[60px] cursor-pointer hover:opacity-90 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute top-0 left-0 w-[327px] h-[60px] bg-white rounded-[29px] shadow-lg" />
              <div className="absolute top-[15px] left-[68px] w-[178px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-black text-xl tracking-[1.00px] leading-[normal]">
                Upload Photo
              </div>
              <img
                className="absolute top-2.5 left-[227px] w-[37px] h-[38px] aspect-[1] object-cover"
                alt="Pic"
                src="/pic.svg"
              />
            </div>
          </>
        )}

        {/* Camera View */}
        {showCamera && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="max-w-full max-h-[450px] rounded-lg"
            />
            <div className="mt-6 flex gap-4">
              <button
                onClick={capturePhoto}
                className="bg-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-gray-100 transition shadow-lg"
              >
                <img src="/cam.svg" alt="Capture" className="w-8 h-8" />
              </button>
              <button
                onClick={closeCamera}
                className="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-red-600 transition shadow-lg text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat History Title */}
      <div className="absolute top-[158px] left-[54px] w-[251px] [font-family:'Poppins-ExtraBold',Helvetica] font-extrabold text-black text-xl tracking-[1.00px] leading-[normal]">
        Chat History
      </div>

      {/* Back Button */}
      <div className="absolute top-[58px] left-[17px] w-[104px] h-[30px] bg-[#d0e58fb2] rounded-[43px] cursor-pointer hover:opacity-80 transition" />

      <img
        className="absolute top-16 left-[33px] w-[17px] h-[17px] aspect-[1] object-cover"
        alt="Back"
        src="/back.svg"
      />

      <div className="absolute top-[60px] left-[59px] w-[47px] [font-family:'Poppins-Bold',Helvetica] font-bold text-[#072d0db0] text-base tracking-[0] leading-[normal]">
        back
      </div>

      {/* Header Decorative Images */}
      <img
        className="absolute top-1.5 left-[1292px] w-[47px] h-[31px] aspect-[1.51]"
        alt="Element"
        src="/6ae923df-a01f-4168-9d3a-9f0563de2a4d-removebg-preview 2.svg"
      />

      {/* User Icons */}
      <img
        className="top-[617px] left-[9px] w-[30px] h-[30px] absolute aspect-[1] object-cover"
        alt="User"
        src="/user (2) 6.svg"
      />

      <img
        className="top-[5px] left-[1396px] w-[35px] h-[35px] absolute aspect-[1] object-cover"
        alt="User"
        src="/user (2) 9.svg"
      />
    </div>
  );
};