"use client";

import { useEffect, useState } from "react";

function formatUsd(value: number) {
  return "$" + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AnimatedSalesValue({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1400;
    let raf = 0;

    const startTimeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(target * eased);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 600);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return <>{formatUsd(value)}</>;
}
