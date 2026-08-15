"use client";

import { useEffect, useState, useRef } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function useKonami() {
  const [activated, setActivated] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const expected = KONAMI[indexRef.current];
      if (e.key === expected) {
        indexRef.current++;
        if (indexRef.current === KONAMI.length) {
          indexRef.current = 0;
          setActivated(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setActivated(false), 4500);
        }
      } else {
        indexRef.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return activated;
}
