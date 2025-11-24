 'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Upload() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Camera state and refs
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);

  const [isIdentifying, setIsIdentifying] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<any[] | null>(null);
  const [identifyError, setIdentifyError] = useState<string | null>(null);

  async function identifyFromFile(file: File) {
    setIsIdentifying(true);
    setIdentifyError(null);
    setPredictions(null);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/identify', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Identification API error');
      const json = await res.json();
      setPredictions(json.predictions || []);
    } catch (err: any) {
      console.error('identifyFromFile error', err);
      setIdentifyError(err?.message || 'Failed to identify image');
      setPredictions(null);
    } finally {
      setIsIdentifying(false);
    }
  }

  async function identifyFromDataUrl(dataUrl: string) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'upload.jpg', { type: blob.type || 'image/jpeg' });
      await identifyFromFile(file);
    } catch (err) {
      console.error('identifyFromDataUrl error', err);
    }
  }

  async function identifyFromUrl(path: string) {
    setIsIdentifying(true);
    setIdentifyError(null);
    setPredictions(null);
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('Failed to fetch demo image');
      const blob = await res.blob();
      const file = new File([blob], 'demo.jpg', { type: blob.type || 'image/jpeg' });
      await identifyFromFile(file);
    } catch (err: any) {
      console.error('identifyFromUrl error', err);
      setIdentifyError(err?.message || 'Failed to fetch demo image');
      setPredictions(null);
    } finally {
      setIsIdentifying(false);
    }
  }

  // Open device camera and display video stream
  async function openCamera() {
    setIsCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      // store stream reference immediately
      streamRef.current = stream;

      // show camera UI first so the <video> element mounts
      setShowCamera(true);

      // wait a tick for the video element to be mounted
      await new Promise((res) => setTimeout(res, 50));

      if (videoRef.current) {
        try { videoRef.current.muted = true; } catch (e) {}
        try { videoRef.current.srcObject = stream; } catch (e) { console.error('failed to set srcObject', e); }

        // when metadata is loaded the video should be visible — clear the loading state
        videoRef.current.onloadedmetadata = () => {
          setIsCameraLoading(false);
          try { videoRef.current?.play().catch(() => {}); } catch (e) {}
        };

        // If metadata already available, clear loading and start playback
        if (videoRef.current.readyState >= 1) {
          setIsCameraLoading(false);
          try { videoRef.current.play().catch(() => {}); } catch (e) {}
        }
      } else {
        // As a fallback, clear the loading indicator after a short delay
        setTimeout(() => {
          setIsCameraLoading(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to open camera', err);
      setShowCamera(false);
      setIsCameraLoading(false);
    }
  }

  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsCameraLoading(false);
  }

  // Capture a photo from the active video stream
  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'camera-capture.jpg', { type: blob.type || 'image/jpeg' });
      // set preview and persist as data URL for consistency with other flows
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        try {
          localStorage.setItem('spot_pending_upload', dataUrl);
          localStorage.removeItem('spot_pending_upload_static');
        } catch (err) {
          console.error('Failed to store camera capture', err);
        }
        setPreview(dataUrl);
      };
      reader.readAsDataURL(file);

      // identify using the captured file
      await identifyFromFile(file);
      // close camera after capture
      closeCamera();
    }, 'image/jpeg');
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem('spot_pending_upload');
      const storedStatic = localStorage.getItem('spot_pending_upload_static');

      // If the landing page requested camera mode, open camera and clear flag
      const openCameraFlag = localStorage.getItem('spot_upload_open_camera');
      if (openCameraFlag) {
        try {
          localStorage.removeItem('spot_upload_open_camera');
        } catch (err) {
          console.error('Failed to clear camera flag', err);
        }
        // open camera and bail out of auto-identify flow
        openCamera();
        return;
      }

      if (stored) {
        setPreview(stored);
        // if data URL is present, identify from it
        identifyFromDataUrl(stored);
      } else if (storedStatic) {
        setPreview(storedStatic);
        // for static sample, fetch and identify
        identifyFromUrl(storedStatic);
      }
    } catch (err) {
      console.error('Failed to read pending upload', err);
    }
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleBack = () => router.push('/');
  const handleLogin = () => router.push('/auth/login');
  const handleSignup = () => router.push('/auth/signup');

  const handleReplaceClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      try {
        localStorage.setItem('spot_pending_upload', data);
      } catch (err) {
        console.error('Failed to store selected image', err);
      }
      setPreview(data);
      // identify using the raw File object
      identifyFromFile(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#f1eee5] relative overflow-hidden font-poppins">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Image 
          src="/landingbg1.png" 
          alt="landing-page-bg"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between w-full mb-12">
          
          {/* LEFT GROUP: Logo, Brand, and Back Link */}
          <div className="flex items-center gap-12"> 
            
            {/* Logo & Brand (Often treated as clickable to go home) */}
            <div className="flex items-center gap-4 cursor-pointer">
              <Image 
                src="/spot icon.svg" 
                alt="spot-icon"
                width={60}
                height={60}
                className="w-12 h-12 md:w-[60px] md:h-[60px]"
              />
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#3a5a2a] tracking-tight">
                SPOT
              </h1>
            </div>

            {/* Back to Home Link (Already a Link, adding explicit cursor) */}
            <button onClick={handleBack} className="text-[16px] font-bold text-[#316138] hover:text-[#1e3d23] transition-colors cursor-pointer">
              &lt; Back to Home
            </button>
          </div>

          {/* RIGHT GROUP: Auth Buttons */}
          <div className="flex items-center gap-6">
            {/* Log In Button */}
            <button onClick={handleLogin} className="text-[16px] font-bold text-[#246540] hover:underline cursor-pointer">
              Log In
            </button>
            {/* Sign Up Button */}
            <button onClick={handleSignup} className="text-[16px] font-bold text-[#26451f] bg-[#d0e690] px-8 py-2.5 rounded-full hover:bg-[#c2d980] transition-colors shadow-sm cursor-pointer">
              Sign Up
            </button>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center mt-4">
          
          {/* Left Side - Image Upload Area (This entire div is clickable) */}
          <div className="w-full lg:w-[650px] h-[500px]">
             {/* file input kept for upload/replace */}
             <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
             {showCamera ? (
               <div className="w-full h-full relative bg-black rounded-[28px] overflow-hidden">
                 {isCameraLoading && (
                   <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white">
                     <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                   </div>
                 )}
                 <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

                 {/* Camera Controls */}
                 <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 z-30">
                   <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                     <img src="/pic.svg" alt="Upload" className="w-6 h-6 object-contain" />
                   </button>

                   <button onClick={capturePhoto} className="group relative w-20 h-20 rounded-full border-4 border-white bg-transparent flex items-center justify-center hover:scale-105 transition-transform shadow-xl mx-2">
                     <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform" />
                   </button>

                   <button onClick={closeCamera} className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center">
                     <span className="text-lg font-bold">×</span>
                   </button>
                 </div>
               </div>
             ) : (
               <div onClick={handleReplaceClick} className="w-full h-full bg-[#d0e690]/30 border-[3px] border-dashed border-[#4a4a4a]/80 rounded-[60px] flex flex-col items-center justify-center hover:bg-[#d0e690]/40 transition-colors cursor-pointer group overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Selected" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center opacity-60 group-hover:opacity-100 transition-opacity">
                      <p className="text-[#3a4216] font-bold text-xl">+ Upload Image</p>
                    </div>
                  )}
               </div>
             )}
          </div>

          {/* Right Side - AI Response & CTA */}
          <div className="w-full lg:w-[500px] flex flex-col gap-8">
            
            {/* AI Response Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[30px] p-8 min-h-[350px] shadow-lg border border-white/50">
              <h2 className="text-[18px] font-bold text-black mb-4">
                AI Response
              </h2>
              <div className="w-full h-[1px] bg-gray-200 mb-4"></div>
              {/* Identification results */}
              {isIdentifying ? (
                <div className="text-sm italic text-gray-600">Identifying image...</div>
              ) : identifyError ? (
                <div className="text-sm text-red-600">{identifyError}</div>
              ) : predictions === null ? (
                <p className="text-gray-400 italic text-sm">Upload an image to identify the species...</p>
              ) : predictions.length === 0 ? (
                <p className="text-sm text-gray-600">No confident identification could be made. Try a clearer photo.</p>
              ) : (
                <div className="space-y-4">
                  {predictions.map((pred: any, idx: number) => (
                    <div key={idx} className="border-t pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{pred.common_name || 'Unknown'}</h3>
                          <p className="text-xs italic text-gray-600">{pred.scientific_name}</p>
                        </div>
                        <div className="text-sm font-semibold">{pred.confidence ?? ''}%</div>
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <span className="text-xs bg-yellow-100 text-black px-2 py-0.5 rounded">{pred.danger_level}</span>
                        <span className="text-xs bg-blue-100 text-black px-2 py-0.5 rounded">{pred.status}</span>
                        <span className="text-xs bg-green-100 text-black px-2 py-0.5 rounded">{pred.conservation_status}</span>
                      </div>
                      {pred.wiki_summary && <p className="text-xs mt-2 text-gray-700">{pred.wiki_summary}</p>}
                      {pred.wiki_link && (
                        <a href={pred.wiki_link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline mt-1 inline-block">Read more</a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <p className="text-[15px] text-[#2d3a1e] mb-6 italic font-medium">
                Want to ask more questions and save your sightings?<br />
                Create your free account and join the SPOT community today!
                <br />
              </p>
              
              {/* Styled Button matching Landing Page */}
              {/* Added cursor-pointer here */}
              <button onClick={handleSignup} className="relative group inline-block cursor-pointer">
                <div className="absolute inset-0 bg-black rounded-[29px] translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
                <div className="relative bg-[#3a4216] rounded-[29px] px-12 py-3 border-2 border-black active:translate-y-1 active:translate-x-1 transition-transform">
                  <span className="text-[20px] font-bold tracking-[0.05em] text-[#c6e54d]">
                    Be an Explorer!
                  </span>
                </div>
              </button>
            </div>
          </div>

        </div>
        {/* preview shown inside the main dashed container; removed duplicate floating preview */}
      </div>
    </div>
  );
}