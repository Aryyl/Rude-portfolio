"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const links = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ mixBlendMode: "difference" }}
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
        <button className="md:hidden text-sm font-medium tracking-wide uppercase opacity-80 hover:opacity-100">
          Menu
        </button>

      </div>
    </nav>
  );
}
