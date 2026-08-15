"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show at top of page, or when scrolling up. Hide when scrolling down past 100px.
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const links = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ mixBlendMode: isMobileMenuOpen ? "normal" : "difference" }}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between text-white">
          
          {/* Logo */}
          <a 
            href="#"
            className="text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity"
          >
            rude.
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wide uppercase opacity-80 hover:opacity-100 transition-opacity relative group"
              >
                {link.name}
                {/* Subtle underline on hover */}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button (Minimal) */}
          <button 
            className="md:hidden text-sm font-medium tracking-wide uppercase opacity-80 hover:opacity-100 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center transition-opacity duration-500 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {links.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-medium tracking-widest uppercase text-white hover:text-white/70 transition-colors"
              style={{
                transitionProperty: "transform, opacity",
                transitionDuration: "0.5s",
                transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
                transitionDelay: isMobileMenuOpen ? `${i * 100}ms` : "0ms",
                transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
