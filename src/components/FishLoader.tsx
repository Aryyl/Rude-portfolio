"use client";

import { useEffect, useState } from "react";

export default function FishLoader() {
  const [loadingState, setLoadingState] = useState<"loading" | "fading" | "done">("loading");

  useEffect(() => {
    // Show the loader for at least 2.5 seconds to allow the animation to play out
    const MIN_TIME = 2500;
    const start = Date.now();

    const completeLoading = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_TIME - elapsed);
      
      setTimeout(() => {
        setLoadingState("fading");
        setTimeout(() => setLoadingState("done"), 800); // 800ms fade out duration
      }, remaining);
    };

    if (document.readyState === "complete") {
      completeLoading();
    } else {
      window.addEventListener("load", completeLoading);
      return () => window.removeEventListener("load", completeLoading);
    }
  }, []);

  if (loadingState === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700 pointer-events-none"
      style={{ opacity: loadingState === "fading" ? 0 : 1 }}
    >
      <div className="relative w-48 h-32 flex items-center justify-center">
        {/* The Jumping Fish */}
        <div 
          className="absolute top-1/2 left-1/2 -ml-[15px] -mt-[15px] text-white/90" 
          style={{ animation: "fish-jump 2s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Body */}
            <path d="M22 12C21.5 10 19 7 15 7S8 10 5 12C8 14 11 17 15 17S21.5 14 22 12Z" />
            {/* Tail */}
            <path d="M2 9L6 12L2 15Z" />
            {/* Eye */}
            <circle cx="17" cy="10" r="1" fill="currentColor" />
          </svg>
        </div>

        {/* Water Surface Line */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center overflow-hidden h-6 opacity-60">
           <svg width="120" height="20" viewBox="0 0 120 20" style={{ animation: "water-wave 3s ease-in-out infinite" }}>
             <path d="M0 10 Q 15 0, 30 10 T 60 10 T 90 10 T 120 10" stroke="white" strokeWidth="1" fill="none" />
           </svg>
        </div>
      </div>
      
      <div className="mt-4 font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase">
        Catching waves...
      </div>

      <style>{`
        @keyframes fish-jump {
          0% {
            transform: translate(-40px, 20px) rotate(-35deg);
            opacity: 0;
          }
          15% { opacity: 1; }
          50% {
            transform: translate(0px, -30px) rotate(0deg);
          }
          85% { opacity: 1; }
          100% {
            transform: translate(40px, 20px) rotate(35deg);
            opacity: 0;
          }
        }
        @keyframes water-wave {
          0% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(-10px); }
        }
      `}</style>
    </div>
  );
}