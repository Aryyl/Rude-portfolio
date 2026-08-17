"use client";

import { useEffect, useState, useRef } from "react";

const BUTTERFLY_ASCII = `
      .==-.                   .-==.
       \\()8\`-._  \`.   .'  _.-'8()/
       (88"   ::.  \\./  .::   "88)
        \\_.'\`-::::.(#).::::-'._/
          \`._... .q(_)p. ..._.'
            ""-..-'   '-..-""
`.trim();

const GLITCH_CHARS = "01!@#$%^&*()<>{}[]/|\\~";

export default function AsciiButterfly() {
  const [displayedText, setDisplayedText] = useState(BUTTERFLY_ASCII);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalChars = BUTTERFLY_ASCII.split("");
    
    const interval = setInterval(() => {
      const glitched = originalChars.map((char) => {
        // Keep spaces intact to maintain the butterfly shape
        if (char === " " || char === "\n") return char;
        
        // 5% chance to glitch a character on each tick
        if (Math.random() < 0.05) {
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        
        return char;
      });
      
      setDisplayedText(glitched.join(""));
    }, 80); // Speed of the glitch effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none mix-blend-screen opacity-10"
      aria-hidden="true"
    >
      <pre 
        className="font-mono text-[6vw] md:text-[3vw] font-bold text-white leading-[1.1] whitespace-pre select-none"
        style={{
          textShadow: "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)"
        }}
      >
        {displayedText}
      </pre>
    </div>
  );
}
