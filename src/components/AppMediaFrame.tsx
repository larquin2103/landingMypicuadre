"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type AppMediaSlide = { src: string; alt: string };

interface AppMediaFrameProps {
  slides: AppMediaSlide[];
  intervalMs?: number;
  preloadFirst?: boolean;
}

export default function AppMediaFrame({ slides, intervalMs = 3500, preloadFirst = false }: AppMediaFrameProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  return (
    <div className="amf">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          preload={preloadFirst && i === 0}
          sizes="(max-width: 768px) 280px, 320px"
          style={{ objectFit: "cover", objectPosition: "top" }}
          className={`amf-slide${i === active ? " amf-slide-active" : ""}`}
        />
      ))}
    </div>
  );
}
