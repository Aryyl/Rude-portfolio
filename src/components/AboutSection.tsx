"use client";

import { Great_Vibes } from "next/font/google";
import Image from "next/image";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

export default function AboutSection() {
  return (
    <section className="relative text-white py-32 px-6 md:px-12 min-h-screen flex items-center justify-center overflow-hidden about-bg-element" style={{ backgroundColor: 'transparent' }}>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none about-stagger">
        {/* Huge background text */}
        <div 
          className={`absolute -left-[10%] top-[10%] text-[20vw] text-white/5 whitespace-nowrap leading-none select-none ${greatVibes.className}`}
          style={{ transform: 'rotate(-5deg)' }}
        >
          Creative
        </div>
        <div 
          className={`absolute -right-[5%] bottom-[5%] text-[15vw] text-white/5 whitespace-nowrap leading-none select-none ${greatVibes.className}`}
          style={{ transform: 'rotate(2deg)' }}
        >
          Visionary
        </div>

        {/* Ambient glows */}
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(88,28,135,0.12)_0%,transparent_70%)] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-stretch">
        
        {/* ── Left Column: Visual Placeholder ── */}
        <div className="w-full lg:w-5/12 flex flex-col">
          <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-black/40 border border-white/10 rounded-lg overflow-hidden flex flex-col items-center justify-center group h-full about-stagger">
              
              {/* Actual Image */}
              <Image 
                src="/rude photo.jpeg"
                alt="Portrait of Rudrangshu Sonowal"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 mix-blend-luminosity hover:mix-blend-normal"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              
              {/* Subtle grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

              {/* Decorative corner brackets */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20" />
            </div>
          </div>

        {/* ── Right Column: Editorial Content ── */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 about-stagger">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
                Behind the Lens
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white/90 leading-[1.05] mb-12 about-stagger">
              The mind behind the <br />
              <span className={`text-[1.3em] font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 leading-none ${greatVibes.className}`}>
                edits.
              </span>
            </h2>

            <div className="flex flex-col space-y-8 text-lg font-light text-white/60 leading-relaxed max-w-2xl about-stagger">
              <p>
                <span className="float-left text-5xl md:text-6xl font-semibold text-white/90 leading-[0.8] pr-4 pt-2">I</span>
                help brands, businesses, and creators transform ideas into compelling visual experiences through thoughtful editing and refined post-production. From luxury product films and commercial advertisements to documentaries, travel films, and social media content, I focus on creating visuals that feel <span className="italic text-white/90 font-normal">intentional, immersive, and memorable.</span>
              </p>
              
              <p>
                Every project is approached with a balance of creativity and precision. I believe great editing is more than seamless transitions—it's about <span className="font-mono text-sm tracking-widest text-white/90 uppercase bg-white/5 px-2 py-1 rounded border border-white/10 mx-1">rhythm</span>, <span className="font-mono text-sm tracking-widest text-white/90 uppercase bg-white/5 px-2 py-1 rounded border border-white/10 mx-1">emotion</span>, and telling a story that resonates with the audience long after the screen goes black.
              </p>
            </div>

            {/* ── Details Grid (Toolkit & Stats) ── */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10 about-stagger">
              
              {/* Arsenal */}
              <div>
                <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-6">
                  The Arsenal
                </p>
                <ul className="flex flex-col gap-4">
                  {[
                    { name: 'DaVinci Resolve', desc: 'Color Science & Mastering' },
                    { name: 'Premiere Pro', desc: 'Non-Linear Editing' },
                    { name: 'After Effects', desc: 'Motion Graphics & VFX' }
                  ].map((tool, i) => (
                    <li key={i} className="flex flex-col group cursor-default">
                      <span className="text-white/80 font-medium group-hover:text-white transition-colors">{tool.name}</span>
                      <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{tool.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div>
                <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-6">
                  By the Numbers
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-bold tracking-tighter text-white">2+</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40">Years of<br/>Experience</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-bold tracking-tighter text-white">500+</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40">Projects<br/>Delivered</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
    </section>
  );
}
