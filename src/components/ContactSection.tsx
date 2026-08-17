"use client";

import { Great_Vibes, Montserrat } from "next/font/google";
import ScrollReveal from "@/components/ScrollReveal";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ weight: ["500", "700"], subsets: ["latin"] });

interface ContactSectionProps {
  onCopyrightClick?: () => void;
}

export default function ContactSection({ onCopyrightClick }: ContactSectionProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative w-full bg-[#0D0D0D] text-white overflow-hidden pt-24 pb-8">
      
      {/* GIF Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <img 
          src="/contact-bg.gif" 
          alt="Background animation" 
          className="w-full h-full object-contain scale-[1.3] md:scale-125"
        />
      </div>

      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}
        />
        {/* Deep ambient glow removed for pitch black background */}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col justify-between items-center text-center">
        
        {/* ── Main CTA Area ── */}
        <div className="flex flex-col items-center w-full mb-16 mt-4">
          <ScrollReveal direction="up" delay={0}>

            <h2 className={`${montserrat.className} text-[2.5rem] md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.95] mb-10 max-w-5xl mx-auto`}>
              Let&apos;s create something
              <br />
              <span className={`${greatVibes.className} font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 text-[1.2em] tracking-normal block mt-2 lg:mt-4 pb-4`}>
                extraordinary.
              </span>
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full mt-8 flex-wrap">
              <a 
                href="mailto:rudrangshusonowal@gmail.com"
                className="group relative flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-full overflow-hidden transition-transform duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/90 group-hover:bg-white transition-colors duration-500" />
                <span className="relative font-medium text-base md:text-lg tracking-tight z-10">
                  rudrangshusonowal@gmail.com
                </span>
              </a>

              <a 
                href="/gallery"
                className="group relative flex items-center justify-center gap-3 px-6 py-4 bg-white/5 text-white border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105"
              >
                <span className="relative font-medium text-base md:text-lg tracking-wide z-10 flex items-center gap-2">
                  View Video Gallery
                </span>
                <span className="relative font-mono text-lg transition-transform duration-500 group-hover:translate-x-1 z-10">
                  →
                </span>
              </a>

              <a 
                href="https://www.instagram.com/rudrangshu___s/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 px-6 py-4 bg-white/5 text-white border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105"
              >
                <span className="relative font-medium text-base md:text-lg tracking-wide z-10 flex items-center gap-2">
                  <span className="text-white/50 font-normal">Instagram</span>
                  @rudrangshu___s
                </span>
                <span className="relative font-mono text-base transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110 z-10">
                  ↗
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Bottom Section (Footer) ── */}
        <div className="w-full mt-auto">
          
          <div className="w-full h-[1px] bg-white/10" />

          {/* ── Footer Bottom Bar ── */}
          <div className="pt-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            
            {/* Easter egg trigger on copyright */}
            <p
              className="font-mono text-[10px] tracking-widest text-white/30 uppercase cursor-pointer select-none hover:text-white/60 transition-colors"
              onClick={onCopyrightClick}
              title="A secret lies beneath the surface..."
            >
              © {currentYear} Rudrangshu Sonowal
            </p>
            
            <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
              Designed & developed with ❤️ by{" "}
              <a 
                href="https://aryyaman-s-about.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 font-semibold hover:text-white transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-white/80"
              >
                Aryyaman Bora
              </a>
            </p>
            
            <a 
              href="#"
              className="font-mono text-[10px] tracking-widest text-white/30 uppercase hover:text-white transition-colors flex items-center gap-2 group"
            >
              Back to top 
              <span className="group-hover:-translate-y-1 transition-transform">↑</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
