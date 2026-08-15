"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: "up" | "down" | "left" | "right" | "none";
  threshold?: number; // 0–1
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.15,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => el.classList.add("sr-visible"), delay);
          } else {
            el.classList.add("sr-visible");
          }
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case "up":    return "translateY(36px)";
      case "down":  return "translateY(-36px)";
      case "left":  return "translateX(36px)";
      case "right": return "translateX(-36px)";
      default:      return "none";
    }
  };

  return (
    <div
      ref={ref}
      className={`sr-wrapper ${className}`}
      style={{
        opacity: 0,
        transform: getInitialTransform(),
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
