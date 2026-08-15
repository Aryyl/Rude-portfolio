"use client";

import { Great_Vibes } from "next/font/google";
import ScrollReveal from "@/components/ScrollReveal";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

interface ContactSectionProps {
  onCopyrightClick?: () => void;
}

export default function ContactSection({ onCopyrightClick }: ContactSectionProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative w-full bg-black text-white overflow-hidden pt-32 pb-8 border-t border-white/5">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col min-h-[60vh] justify-between">
        
        {/* ── Main CTA Area ── */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-24">
          
          {/* Left: Huge typography */}
          <div className="flex flex-col flex-1">
            <ScrollReveal direction="up" delay={0}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
                  Ready to start?
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[1.1] mb-12">
                Let&apos;s create something{" "}
                <br className="hidden md:block" />
                <span className={`${greatVibes.className} font-normal text-white/50 text-[1.2em] tracking-normal`}>
                  extraordinary.
                </span>
              </h2>

              <a 
                href="mailto:hello@rudrangshu.com"
                className="group relative w-fit block"
              >
                <span className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white/80 group-hover:text-white transition-colors duration-500">
                  hello@rudrangshu.com
                </span>
                <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-700 ease-out" />
              </a>
            </ScrollReveal>
          </div>

          {/* Right: Social Links Grid */}
          <div className="lg:w-1/3 flex flex-col justify-end">
            <ScrollReveal direction="up" delay={200}>
              <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-6 lg:text-right">
                Connect
              </p>
              <ul className="flex flex-col gap-0 w-full border-t border-white/10">
                {[
                  { name: 'Instagram', url: '#' },
                  { name: 'X (Twitter)', url: '#' },
                  { name: 'YouTube', url: '#' },
                  { name: 'LinkedIn', url: '#' },
                  { name: 'Vimeo', url: '#' }
                ].map((social, i) => (
                  <li key={social.name} className="border-b border-white/10">
                    <a 
                      href={social.url}
                      className="group flex items-center justify-between py-5 text-white/60 hover:text-white transition-colors duration-300"
                    >
                      <span className="text-lg md:text-xl font-light">{social.name}</span>
                      <span className="font-mono text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Scrolling Marquee ── */}
        <div className="relative w-full overflow-hidden py-12 flex items-center border-y border-white/5 bg-white/[0.01]">
           <div className="flex whitespace-nowrap animate-marquee">
             {/* Render it multiple times for seamless loop */}
             {[...Array(4)].map((_, i) => (
                <span key={i} className="font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-white/40 mx-8">
                  Rudrangshu Sonowal ✦ Available for freelance work ✦
                </span>
             ))}
           </div>
           
           {/* Add a fade to edges of marquee */}
           <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none" />
           <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </div>

        {/* ── Footer Bottom Bar ── */}
        <div className="pt-8 mt-12 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
          
          {/* Easter egg trigger on copyright */}
          <p
            className="font-mono text-[10px] tracking-widest text-white/30 uppercase cursor-pointer select-none hover:text-white/50 transition-colors"
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
              className="text-white font-semibold hover:text-white/80 transition-colors underline decoration-white/30 underline-offset-4 hover:decoration-white"
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
    </footer>
  );
}
