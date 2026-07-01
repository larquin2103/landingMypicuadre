"use client";

import { useEffect } from "react";

const GRID_SELECTOR = ".ben-g, .feat-g, .tst-g, .steps, .faq-g";

export default function ScrollRevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -28px 0px" }
    );

    const revealEls = document.querySelectorAll<HTMLElement>(".rv");
    revealEls.forEach((el) => {
      const gridParent = el.closest(GRID_SELECTOR);
      if (gridParent) {
        const siblings = Array.from(gridParent.querySelectorAll<HTMLElement>(".rv"));
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * 0.08}s`;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
