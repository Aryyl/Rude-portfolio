"use client";

import { useState, useEffect, useRef } from "react";

interface TextLoopProps {
  items: string[];
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function TextLoop({
  items,
  interval = 3000,
  className = "",
  style = {},
}: TextLoopProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Single interval — no nested setTimeout, no drift
    timerRef.current = setInterval(() => {
      // Fade out
      setVisible(false);
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interval]);

  // When visibility goes false, advance index and fade back in after CSS transition duration
  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => {
      setIndex(prev => (prev + 1) % items.length);
      setVisible(true);
    }, 400); // matches CSS transition duration
    return () => clearTimeout(t);
  }, [visible, items.length]);

  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        // Use will-change so browser promotes to its own layer
        willChange: "opacity",
      }}
    >
      {items[index]}
    </div>
  );
}