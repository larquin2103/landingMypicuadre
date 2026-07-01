# Landing Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-drawn app mockups and flat cards across the MypiCuadre landing page with real app screenshots and a richer, consistent "depth" visual treatment, per `docs/superpowers/specs/2026-07-01-landing-visual-refresh-design.md`.

**Architecture:** A new shared `AppMediaFrame` client component renders a crossfading slideshow of real screenshots inside the existing phone-chrome CSS (`.mock-device`, `.prev-screen`), replacing the div-drawn fake app UI in `Hero` and `AppPreview`. A new shared `.card-shot` CSS pattern and gradient "rich card" treatment is applied to `Benefits`, `Features`, `Testimonials`, and `Comparison`. A new `AnimatedCounter` component (generalizing the existing `AnimatedSalesValue` count-up pattern) drives the "+500 negocios" numbers.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, plain CSS (no Tailwind utility classes used in this codebase — `globals.css` holds all component styles), `next/image`.

## Global Constraints

- Do not change the color palette or typography tokens in `:root` (`src/app/globals.css:1-37`).
- Do not modify `Navbar`, `Footer`, or `FAQ` — out of scope per the spec.
- No video implementation yet — `AppMediaFrame` must only need a slides array now; do not build a video branch that has no caller.
- This repo has no test runner configured (`package.json` has no `test` script, no Jest/Vitest/Testing Library installed). Do **not** add one — out of scope (YAGNI). "Testing" in this plan means: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and manual visual verification via `npm run dev`.
- This project runs on Next.js 16, which has API changes vs. older Next.js versions. Confirmed differences relevant to this plan (verified against `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`):
  - There is no `priority` prop on `next/image`'s `<Image>` — it was renamed to `preload`.
  - There is no top-level `objectFit` prop — cropping is done via `style={{ objectFit: "cover" }}`.
- All new/changed screenshots referenced by `src="/app-media/....jpg"` already exist in `public/app-media/` (added in the previous commit `10a4dc1`) — do not re-copy or rename them.
- Respect `prefers-reduced-motion: reduce` for every new animation (crossfade, count-up, hover tilt, pulse, cascade reveal), matching the existing block at `src/app/globals.css:388-396`.

---

### Task 1: `AppMediaFrame` shared component

**Files:**
- Create: `src/components/AppMediaFrame.tsx`
- Modify: `src/app/globals.css` (append new rules, do not remove anything in this task)

**Interfaces:**
- Produces: `export default function AppMediaFrame({ slides, intervalMs, preloadFirst }: AppMediaFrameProps)` where `AppMediaFrameProps = { slides: { src: string; alt: string }[]; intervalMs?: number; preloadFirst?: boolean }`. Renders a `<div className="amf">` filling its parent (parent must be `position: relative` with a fixed size or `aspect-ratio` — provided by the parent's own CSS, not by this component).
- Consumes: nothing from other tasks.

- [ ] **Step 1: Create the component**

```tsx
// src/components/AppMediaFrame.tsx
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
```

- [ ] **Step 2: Add the base CSS**

Append to `src/app/globals.css`, right before the `RESPONSIVE` section comment (`/* ═══... RESPONSIVE ═══... */`):

```css
/* ═══════════════════════════════
   APP MEDIA FRAME
═══════════════════════════════ */
.amf { position: relative; width: 100%; height: 100%; }
.amf-slide { opacity: 0; transition: opacity .7s var(--ease); }
.amf-slide-active { opacity: 1; }
```

And extend the existing reduced-motion block (find `@media (prefers-reduced-motion: reduce) {` near the end of the file) so it reads:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .au, .hero-dot, .mock-device, .fc-ok, .fc-of, .rv {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .amf-slide { transition: none !important; opacity: 1 !important; }
}
```

- [ ] **Step 3: Verify it type-checks and lints**

Run: `npm run lint`
Expected: no errors (the component isn't imported anywhere yet, so there will be no "unused" warnings from other files, but ESLint should report zero problems for the new file itself).

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/AppMediaFrame.tsx src/app/globals.css
git commit -m "feat: add AppMediaFrame component for real app screenshot slideshows"
```

---

### Task 2: `AnimatedCounter` shared component

**Files:**
- Create: `src/components/AnimatedCounter.tsx`

**Interfaces:**
- Produces: `export default function AnimatedCounter({ target, duration }: { target: number; duration?: number })`. Renders a `<span>` containing the animated integer. Triggers when scrolled into view (not on mount), so it's safe to use both above the fold (Hero) and below the fold (CTA).
- Consumes: nothing from other tasks.

- [ ] **Step 1: Create the component**

```tsx
// src/components/AnimatedCounter.tsx
"use client";

import { useEffect, useRef, useState } from "react";

function formatInt(value: number) {
  return Math.round(value).toString();
}

export default function AnimatedCounter({ target, duration = 1400 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let raf = 0;
    let started = false;

    const animate = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(target * eased);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return <span ref={ref}>{formatInt(value)}</span>;
}
```

- [ ] **Step 2: Verify it type-checks and lints**

Run: `npm run lint && npx tsc --noEmit`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/AnimatedCounter.tsx
git commit -m "feat: add AnimatedCounter component for scroll-triggered count-up numbers"
```

---

### Task 3: Hero — real screenshot carousel + counter

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `AppMediaFrame` (Task 1, `src/components/AppMediaFrame.tsx`, prop shape `{ slides, intervalMs?, preloadFirst? }`), `AnimatedCounter` (Task 2, `src/components/AnimatedCounter.tsx`, prop shape `{ target, duration? }`).

- [ ] **Step 1: Replace the hand-drawn mock device with `AppMediaFrame`, and the static "+500" with `AnimatedCounter`**

Replace the full contents of `src/components/Hero.tsx` with:

```tsx
import AnimatedCounter from "@/components/AnimatedCounter";
import AppMediaFrame from "@/components/AppMediaFrame";

const HERO_SLIDES = [
  { src: "/app-media/Screenshot_20260628_085305.jpg", alt: "Panel del dueño con ventas netas y métodos de pago en MypiCuadre" },
  { src: "/app-media/Screenshot_20260628_083805.jpg", alt: "Turno activo con caja del turno en MypiCuadre" },
  { src: "/app-media/Screenshot_20260628_083951.jpg", alt: "Cuadre de caja por denominación en MypiCuadre" },
];

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-glow2"></div>
      <div className="wrap">
        <div className="hero-i">

          <div className="hero-copy">
            <div className="hero-badge au">
              <span className="hero-dot"></span>
              100% sin internet · Siempre disponible
            </div>
            <h1 className="au au-d1">Tu negocio<br /><span className="hero-em">siempre cuadrado,</span><br />en cualquier lugar</h1>
            <p className="hero-sub au au-d2">Controla ventas, caja e inventario desde tu teléfono. Sin hojas de cálculo, sin cuadernos, sin perder datos. Hecho para pequeños negocios latinoamericanos.</p>
            <div className="hero-ctas au au-d3">
              <a href="#cta" className="btn btn-em btn-lg" id="cta">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5v8M7.5 9.5l-3-3M7.5 9.5l3-3M1.5 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Instalar Demo gratis
              </a>
              <a href="#app-preview" className="btn btn-od btn-lg">Ver la aplicación</a>
            </div>
            <div className="hero-trust au au-d4">
              <div className="ht">
                <div className="avs">
                  <div className="av" style={{ background: "#1DC879", color: "#102B50" }}>MR</div>
                  <div className="av" style={{ background: "#4B76B8", color: "#FFF" }}>CG</div>
                  <div className="av" style={{ background: "#E09B1A", color: "#FFF" }}>AL</div>
                </div>
                <span>+<AnimatedCounter target={500} /> negocios activos</span>
              </div>
              <div className="ht">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 4h4L9 7.5 10.5 12 7 9.5 3.5 12 5 7.5 1.5 5h4L7 1Z" fill="#F59E0B" /></svg>
                <span>4.9 · 200+ reseñas</span>
              </div>
              <div className="ht">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3L11 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span>Sin tarjeta requerida</span>
              </div>
            </div>
          </div>

          <div className="hero-mock au au-d2">
            <div className="mock-wrap">
              <div className="fc fc-ok">
                <div className="fc-ik">
                  <div className="fc-dot"></div>
                  <div>
                    <div className="fc-label">Auditoría 100% trazable</div>
                    <div className="fc-sub">Nada se borra</div>
                  </div>
                </div>
              </div>
              <div className="mock-device mock-device--media">
                <AppMediaFrame slides={HERO_SLIDES} intervalMs={3500} preloadFirst />
              </div>
              <div className="fc fc-of">
                <div className="fc-ik">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M9.5 4.5A5 5 0 0112 7M5.7 2.7A5 5 0 017 2.5M7 7a2 2 0 012 2M7 7a2 2 0 00-1.41.59M7 10v.5" stroke="var(--em-dk)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <div>
                    <div className="fc-label" style={{ color: "var(--em-dk)" }}>Sin WiFi · OK</div>
                    <div className="fc-sub">Datos guardados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
```

Note: `AnimatedSalesValue` is no longer imported since the fake `mock-sc-v` sales figure no longer exists in this file — it lived only inside the deleted hand-drawn mock body.

- [ ] **Step 1b: Delete the now-unused `AnimatedSalesValue` component**

After Step 1, `src/components/AnimatedSalesValue.tsx` has no remaining callers anywhere in the codebase (it was only ever used by the old `Hero.tsx` mock body). Delete it:

```bash
rm src/components/AnimatedSalesValue.tsx
```

- [ ] **Step 2: Add the media-frame sizing rule and remove now-dead mock-content CSS**

In `src/app/globals.css`, in the `HERO` section, find this line:

```css
.mock-device { width: 320px; background: #0A1E38; border-radius: 28px; overflow: hidden; box-shadow: var(--sh-l), 0 0 0 1px rgba(255,255,255,.07), 0 0 0 0 transparent; position: relative; z-index: 2; animation: float 5s var(--ease) infinite; will-change: transform; }
```

Add this rule directly after it:

```css
.mock-device--media { aspect-ratio: 9 / 19.5; }
```

Then delete the following now-unused rules (nothing else in the codebase references these classes after Step 1 removes their only usage in `Hero.tsx`):

```css
.mock-sb { background: #091729; padding: 12px 20px 10px; display: flex; align-items: center; justify-content: space-between; }
.mock-sn { font-family: var(--fh); font-size: 16px; font-weight: 700; color: #FFF; }
.mock-ss { display: flex; align-items: center; gap: 5px; font-family: var(--fm); font-size: 11px; color: var(--em); }
.mock-sd { width: 6px; height: 6px; border-radius: 50%; background: var(--em); }
.mock-body { background: var(--bg); padding: 14px; }
.mock-sc { background: var(--navy); border-radius: 14px; padding: 18px 16px 16px; margin-bottom: 10px; position: relative; overflow: hidden; }
.mock-sc::after { content: ''; position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(29,200,121,.10); }
.mock-sc-l { font-size: 10px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; color: rgba(255,255,255,.45); margin-bottom: 6px; }
.mock-sc-v { font-family: var(--fm); font-size: 30px; font-weight: 600; color: #FFF; letter-spacing: -0.02em; line-height: 1; }
.mock-sc-s { font-size: 11px; color: rgba(255,255,255,.4); margin-top: 5px; display: flex; align-items: center; gap: 4px; }
.mock-sc-up { color: var(--em); font-weight: 600; }
.mock-mets { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
.mock-met { background: #FFF; border: 1px solid var(--bd); border-radius: 10px; padding: 10px 12px; }
.mock-met-l { font-size: 9px; font-weight: 600; color: var(--t3); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 3px; }
.mock-met-v { font-family: var(--fm); font-size: 16px; font-weight: 600; color: var(--t1); }
.mock-qa { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; }
.mock-qb { background: #FFF; border: 1px solid var(--bd); border-radius: 9px; padding: 9px 8px; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; color: var(--t2); text-align: center; cursor: default; transition: border-color .15s; }
.mock-qb.hi { background: var(--em); border-color: var(--em); color: var(--navy); }
.mock-qi { width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.mock-txl-h { font-size: 9px; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 6px; }
.mock-tx { display: flex; align-items: center; gap: 8px; padding: 7px 0; border-bottom: 1px solid var(--bd); }
.mock-tx:last-child { border: none; }
.mock-tx-ic { width: 7px; height: 7px; border-radius: 50%; background: var(--em); flex-shrink: 0; }
.mock-tx-n { font-size: 11px; font-weight: 500; color: var(--t1); flex: 1; }
.mock-tx-a { font-family: var(--fm); font-size: 11px; font-weight: 600; color: var(--t1); }
```

Keep everything else in the `HERO` section (`.hero`, `.hero-i`, `.hero-badge`, `.hero-mock`, `.mock-wrap`, `.fc*` floating-card rules) unchanged.

Also check the responsive section near the bottom of the file for this line and leave it as-is (it still applies, just to a shorter device now):

```css
.mock-device { width: 280px; }
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: both exit 0. (ESLint will fail if `AnimatedSalesValue` is still imported but unused — confirm it was removed in Step 1.)

Run: `npm run dev`, open `http://localhost:3000`, confirm:
- The Hero phone shows a real screenshot (not the old drawn UI), cycling between 3 screens every ~3.5s with a crossfade.
- Both floating cards ("Auditoría 100% trazable", "Sin WiFi · OK") still float in their original positions.
- "+500 negocios activos" counts up from 0 shortly after page load.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx src/app/globals.css src/components/AnimatedSalesValue.tsx
git commit -m "feat: replace hero's drawn app mockup with real screenshot carousel"
```

---

### Task 4: AppPreview — real screenshots instead of the drawn inventory table

**Files:**
- Modify: `src/components/AppPreview.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `AppMediaFrame` (Task 1).

- [ ] **Step 1: Replace the drawn inventory table with `AppMediaFrame`**

Replace the full contents of `src/components/AppPreview.tsx` with:

```tsx
import AppMediaFrame from "@/components/AppMediaFrame";

const PREVIEW_FEATURES = [
  "Resumen de ventas en tiempo real",
  "Búsqueda rápida de productos por nombre",
  "Cuadre automático al cerrar turno",
  "Alertas de stock bajo configurables",
  "Exportación a PDF sin configuración",
];

const PREVIEW_SLIDES = [
  { src: "/app-media/Screenshot_20260628_133510.jpg", alt: "Catálogo de productos con stock y precio en MypiCuadre" },
  { src: "/app-media/Screenshot_20260628_083951.jpg", alt: "Cuadre de caja por denominación en MypiCuadre" },
  { src: "/app-media/Screenshot_20260628_085353.jpg", alt: "Reportes exportables en MypiCuadre" },
];

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M1.5 5.5l3 3L9.5 2" stroke="var(--em-dk)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AppPreview() {
  return (
    <section className="prev-s sp" id="app-preview">
      <div className="wrap">
        <div className="prev-i">
          <div className="prev-copy rv">
            <span className="ey">Vista previa</span>
            <h2>Diseñada para usarse con una sola mano, en medio del trabajo</h2>
            <p>Interfaz limpia, sin pantallas de carga, sin menús profundos. Cada función a máximo dos toques. Probada con comerciantes reales en condiciones reales.</p>
            <div className="prev-feats">
              {PREVIEW_FEATURES.map((feature) => (
                <div className="prev-f" key={feature}>
                  <div className="prev-f-ic"><CheckIcon /></div>
                  <span className="prev-f-t">{feature}</span>
                </div>
              ))}
            </div>
            <a href="#cta" className="btn btn-em">Instalar Demo y explorar</a>
          </div>
          <div className="rv">
            <div className="prev-screen prev-screen--media">
              <AppMediaFrame slides={PREVIEW_SLIDES} intervalMs={4500} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add the media-frame sizing rule and remove now-dead table CSS**

In `src/app/globals.css`, in the `APP PREVIEW` section, find:

```css
.prev-screen { background: var(--navy); border-radius: 20px; overflow: hidden; box-shadow: var(--sh-l); }
```

Add this rule directly after it:

```css
.prev-screen--media { position: relative; aspect-ratio: 9 / 16; }
```

Then delete these now-unused rules (their only usage was the deleted fake header/table markup):

```css
.prev-screen-hd { padding: 16px 20px; background: #091729; display: flex; align-items: center; justify-content: space-between; }
.prev-screen-ttl { font-family: var(--fh); font-size: 15px; font-weight: 700; color: #FFF; }
.prev-screen-sub { font-size: 10px; color: rgba(255,255,255,.4); font-family: var(--fm); }
.prev-screen-btn { background: rgba(255,255,255,.1); border: none; border-radius: 6px; padding: 6px 10px; font-size: 11px; color: rgba(255,255,255,.7); cursor: default; }
.prev-tbl { padding: 16px 18px 18px; }
.prev-tbl-hd { display: grid; grid-template-columns: 1fr 56px 70px; gap: 8px; padding: 7px 0 10px; border-bottom: 1.5px solid rgba(255,255,255,.1); }
.prev-tbl-hl { font-size: 9px; font-weight: 700; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .09em; }
.prev-tbl-hl:nth-child(2) { text-align: center; }
.prev-tbl-hl:last-child { text-align: right; }
.prev-row { display: grid; grid-template-columns: 1fr 56px 70px; gap: 8px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,.06); align-items: center; }
.prev-row:last-child { border: none; }
.prev-pn { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.9); }
.prev-ps { font-family: var(--fm); font-size: 12px; font-weight: 600; text-align: center; }
.prev-pp { font-family: var(--fm); font-size: 12px; color: rgba(255,255,255,.6); text-align: right; }
```

Keep `.prev-s`, `.prev-i`, `.prev-copy*`, `.prev-feats`, `.prev-f*` unchanged.

- [ ] **Step 3: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: both exit 0.

Run: `npm run dev`, scroll to the "Vista previa" section, confirm it shows a real screenshot (Catálogo) inside the navy phone-style panel, cycling every ~4.5s to Cuadre then Reportes.

- [ ] **Step 4: Commit**

```bash
git add src/components/AppPreview.tsx src/app/globals.css
git commit -m "feat: replace AppPreview's drawn inventory table with real screenshots"
```

---

### Task 5: Benefits — rich cards with real screenshot accents

**Files:**
- Modify: `src/components/Benefits.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `.card-shot` CSS class (shared with Task 6/Features) — a `position: relative` strip with fixed `aspect-ratio` meant to contain a `next/image` with `fill`.

- [ ] **Step 1: Rewrite Benefits.tsx with per-item optional screenshot and unified icon color**

Replace the full contents of `src/components/Benefits.tsx` with:

```tsx
import type { ReactNode } from "react";
import Image from "next/image";

type Benefit = {
  title: string;
  text: string;
  icon: ReactNode;
  shot?: { src: string; alt: string };
};

const BENEFITS: Benefit[] = [
  {
    title: "Sin internet, sin problemas",
    text: "Trabaja completamente offline. Guarda cada venta en tu teléfono. Cuando regresa la señal, sincroniza todo solo.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="7.5" stroke="var(--navy)" strokeWidth="1.7" /><path d="M7.5 11h7M11 7.5v7" stroke="var(--navy)" strokeWidth="1.7" strokeLinecap="round" /><circle cx="11" cy="11" r="2" fill="var(--navy)" /></svg>
    ),
  },
  {
    title: "Ventas en segundos",
    text: "Busca el producto, indica la cantidad, acepta el pago. El stock y la caja se actualizan en el momento.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="12" rx="2" stroke="var(--navy)" strokeWidth="1.7" /><path d="M3 8h16" stroke="var(--navy)" strokeWidth="1.7" opacity=".5" /><path d="M7 12h8" stroke="var(--navy)" strokeWidth="1.7" strokeLinecap="round" /></svg>
    ),
    shot: { src: "/app-media/Screenshot_20260628_131946.jpg", alt: "Detalle de ventas del turno en MypiCuadre" },
  },
  {
    title: "Caja que siempre cuadra",
    text: "Abre y cierra turnos con un toque. El cuadre automático detecta diferencias al instante y las registra.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="4" width="14" height="14" rx="2" stroke="var(--navy)" strokeWidth="1.7" /><path d="M8 11l2.5 2.5L15 8" stroke="var(--navy)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
    shot: { src: "/app-media/Screenshot_20260628_083951.jpg", alt: "Pantalla de cuadre de caja por denominación en MypiCuadre" },
  },
  {
    title: "Reportes instantáneos",
    text: "Ventas del día, semana o mes. Productos más vendidos. Todo en pantalla o exportado a PDF con un toque.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 16V9M10 16V4M15 16v-6" stroke="var(--navy)" strokeWidth="1.7" strokeLinecap="round" /><path d="M5 9l3 3" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
    shot: { src: "/app-media/Screenshot_20260628_085353.jpg", alt: "Pantalla de reportes exportables en MypiCuadre" },
  },
];

export default function Benefits() {
  return (
    <section className="benefits sp" id="beneficios">
      <div className="wrap">
        <div className="sh rv">
          <span className="ey">Por qué MypiCuadre</span>
          <h2>Todo lo que tu negocio necesita,<br />en un solo lugar</h2>
          <p>Diseñado para comercios latinoamericanos que operan en la realidad del día a día, no en condiciones ideales.</p>
        </div>
        <div className="ben-g">
          {BENEFITS.map((b) => (
            <div className={`ben-c rv${b.shot ? " ben-c--shot" : ""}`} key={b.title}>
              <div className="ben-ico">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              {b.shot && (
                <div className="card-shot">
                  <Image src={b.shot.src} alt={b.shot.alt} fill sizes="(max-width: 768px) 90vw, 260px" style={{ objectFit: "cover", objectPosition: "top" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add the rich card CSS**

In `src/app/globals.css`, replace the entire `BENEFITS` section (from the `/* ═══... BENEFITS ═══... */` comment through the line before `/* ═══... APP PREVIEW ═══... */`) with:

```css
/* ═══════════════════════════════
   BENEFITS
═══════════════════════════════ */
.benefits { background: var(--s1); }
.ben-g { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.ben-c { background: linear-gradient(155deg, var(--navy) 0%, var(--navy-h) 100%); border-radius: var(--r-xl); padding: 32px 28px 30px; position: relative; overflow: hidden; box-shadow: 0 16px 48px rgba(16,43,80,.28), 0 4px 14px rgba(16,43,80,.14); transition: box-shadow .25s var(--ease), transform .25s var(--ease); }
.ben-c::before { content: ''; position: absolute; top: -40px; right: -40px; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(29,200,121,.18) 0%, transparent 70%); pointer-events: none; }
.ben-c:hover { box-shadow: 0 22px 56px rgba(16,43,80,.34), 0 6px 18px rgba(16,43,80,.16); transform: translateY(-4px) perspective(600px) rotateX(1.5deg); }
.ben-ico { width: 48px; height: 48px; border-radius: var(--r-m); background: linear-gradient(155deg, var(--em), var(--em-dk)); display: flex; align-items: center; justify-content: center; margin-bottom: 22px; box-shadow: 0 4px 14px rgba(29,200,121,.35), inset 0 1px 0 rgba(255,255,255,.25); position: relative; z-index: 1; transition: transform .25s var(--ease); }
.ben-c:hover .ben-ico { transform: rotate(-4deg) scale(1.05); }
.ben-c h3 { font-size: 16px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.015em; color: #FFF; position: relative; z-index: 1; }
.ben-c p { font-size: 14px; line-height: 1.68; color: rgba(255,255,255,.6); position: relative; z-index: 1; }
.ben-c--shot p { margin-bottom: 18px; }
.card-shot { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: #091729; opacity: 0; transform: translateY(14px); transition: opacity .5s var(--ease) .18s, transform .5s var(--ease) .18s; }
.ben-c--shot .card-shot { margin: 0 -28px -30px; border-radius: 0 0 var(--r-xl) var(--r-xl); }
.ben-c.in .card-shot { opacity: 1; transform: none; }
```

Then, in the `RESPONSIVE` section near the bottom of the file, leave `.ben-g { grid-template-columns: repeat(2, 1fr); }` (both occurrences, at the 1024px and 768px breakpoints) unchanged — the new card content reflows fine at 2 columns.

- [ ] **Step 3: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: both exit 0.

Run: `npm run dev`, scroll to "Por qué MypiCuadre":
- All 4 cards show a dark navy gradient background with a green-gradient icon (no more per-card icon color variation).
- The 3 cards with a `shot` (Ventas, Caja, Reportes) show a real screenshot strip at the bottom that fades/slides in slightly after the card's own fade-in.
- The "Sin internet" card has no screenshot strip and looks intentional (not like something is missing).

- [ ] **Step 4: Commit**

```bash
git add src/components/Benefits.tsx src/app/globals.css
git commit -m "feat: give Benefits cards a rich gradient treatment with real screenshot accents"
```

---

### Task 6: Features — rich cards with real screenshot accents

**Files:**
- Modify: `src/components/Features.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `.card-shot` CSS class (Task 5).

- [ ] **Step 1: Rewrite Features.tsx with per-item optional screenshot and unified icon color**

Replace the full contents of `src/components/Features.tsx` with:

```tsx
import type { ReactNode } from "react";
import Image from "next/image";

type Feature = {
  title: string;
  text: string;
  icon: ReactNode;
  shot?: { src: string; alt: string };
};

const FEATURES: Feature[] = [
  {
    title: "Punto de Venta",
    text: "Registra ventas en segundos. Busca productos, calcula cambio, acepta efectivo o pago digital, genera comprobantes.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="12" rx="2" stroke="var(--navy)" strokeWidth="1.6" /><path d="M3 8h14" stroke="var(--navy)" strokeWidth="1.6" opacity=".5" /><path d="M7 12h6" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ),
    shot: { src: "/app-media/Screenshot_20260628_083805.jpg", alt: "Registrar venta en el turno activo de MypiCuadre" },
  },
  {
    title: "Control de Caja",
    text: "Abre turnos con fondo inicial, registra ingresos y egresos. Cuadre automático al cierre: cero errores de suma.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="5" width="12" height="10" rx="1.5" stroke="var(--navy)" strokeWidth="1.6" /><path d="M4 8h12" stroke="var(--navy)" strokeWidth="1.6" opacity=".5" /><path d="M8 12h4M10 10v4" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ),
    shot: { src: "/app-media/Screenshot_20260628_083842.jpg", alt: "Asistente de cierre de turno en MypiCuadre" },
  },
  {
    title: "Inventario",
    text: "Stock actualizado automáticamente con cada venta. Alertas de producto bajo. Historial de movimientos completo.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5h10M5 10h10M5 15h6" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" /><circle cx="15.5" cy="14.5" r="2.5" stroke="var(--navy)" strokeWidth="1.5" /></svg>
    ),
    shot: { src: "/app-media/Screenshot_20260628_133510.jpg", alt: "Catálogo de productos en MypiCuadre" },
  },
  {
    title: "Gestión de Turnos",
    text: "Asigna empleados a turnos independientes. Cada turno tiene su propio historial, responsable y cuadre de caja.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7.5" r="3.5" stroke="var(--navy)" strokeWidth="1.6" /><path d="M5 17c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ),
    shot: { src: "/app-media/Screenshot_20260628_131914.jpg", alt: "Inicio del vendedor con turno abierto en MypiCuadre" },
  },
  {
    title: "Reportes y Analytics",
    text: "Ventas por período, productos más vendidos, diferencias de caja. Exportable a PDF con un toque.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 15V8M10 15V4M15 15V9" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ),
    shot: { src: "/app-media/Screenshot_20260628_085305.jpg", alt: "Panel del dueño con gráfico de métodos de pago en MypiCuadre" },
  },
  {
    title: "Modo Sin Conexión",
    text: "Opera 100% offline. Sincronización automática en segundo plano cuando vuelve la señal. Sin pérdida de datos.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6.5" stroke="var(--navy)" strokeWidth="1.6" /><circle cx="10" cy="10" r="2" fill="var(--navy)" /><path d="M10 5.5V7M10 13v1.5M5.5 10H7M13 10h1.5" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="feats-s sp" id="funcionalidades">
      <div className="wrap">
        <div className="sh rv">
          <span className="ey">Funcionalidades</span>
          <h2>Todo incluido desde el primer día</h2>
          <p>Seis módulos integrados que cubren el ciclo completo de operación sin configuraciones adicionales.</p>
        </div>
        <div className="feat-g">
          {FEATURES.map((f) => (
            <div className={`feat-c rv${f.shot ? " feat-c--shot" : ""}`} key={f.title}>
              <div className="feat-ico">{f.icon}</div>
              <div className="feat-body">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                {f.shot && (
                  <div className="card-shot">
                    <Image src={f.shot.src} alt={f.shot.alt} fill sizes="(max-width: 768px) 90vw, 240px" style={{ objectFit: "cover", objectPosition: "top" }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Note: the original markup had `<div><h3>...</h3><p>...</p></div>` as a bare wrapper around title+text, sitting next to `.feat-ico` in a flex row (`.feat-c { display: flex; gap: 18px; align-items: flex-start; }`). That wrapper gets a name (`feat-body`) in Step 2 below so the new `.card-shot` (which must span the card's full width, not just the text column) can be pulled out of the flex flow with CSS.

- [ ] **Step 2: Add the rich card CSS**

In `src/app/globals.css`, replace the entire `FEATURES` section (from the `/* ═══... FEATURES ═══... */` comment through the line before `/* ═══... HOW IT WORKS ═══... */`) with:

```css
/* ═══════════════════════════════
   FEATURES
═══════════════════════════════ */
.feats-s { background: var(--s1); }
.feat-g { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.feat-c { background: linear-gradient(155deg, var(--navy) 0%, var(--navy-h) 100%); border-radius: var(--r-l); padding: 28px 26px; display: flex; flex-direction: column; gap: 0; position: relative; overflow: hidden; box-shadow: 0 16px 48px rgba(16,43,80,.28), 0 4px 14px rgba(16,43,80,.14); transition: box-shadow .25s var(--ease), transform .25s var(--ease); }
.feat-c::before { content: ''; position: absolute; top: -40px; right: -40px; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(29,200,121,.16) 0%, transparent 70%); pointer-events: none; }
.feat-c:hover { box-shadow: 0 22px 56px rgba(16,43,80,.34), 0 6px 18px rgba(16,43,80,.16); transform: translateY(-3px) perspective(600px) rotateX(1.5deg); }
.feat-c .feat-body { display: flex; flex-direction: column; gap: 0; }
.feat-ico { width: 44px; height: 44px; border-radius: var(--r-m); background: linear-gradient(155deg, var(--em), var(--em-dk)); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 4px 14px rgba(29,200,121,.35), inset 0 1px 0 rgba(255,255,255,.25); position: relative; z-index: 1; flex-shrink: 0; transition: transform .25s var(--ease); }
.feat-c:hover .feat-ico { transform: rotate(-4deg) scale(1.05); }
.feat-c h3 { font-size: 15px; font-weight: 700; margin-bottom: 7px; letter-spacing: -0.012em; color: #FFF; position: relative; z-index: 1; }
.feat-c p { font-size: 14px; color: rgba(255,255,255,.6); line-height: 1.65; position: relative; z-index: 1; }
.feat-c--shot p { margin-bottom: 18px; }
.feat-c--shot .card-shot { margin: 0 -26px -28px; border-radius: 0 0 var(--r-l) var(--r-l); }
```

(`.card-shot`'s shared base rules — `position`, `aspect-ratio`, `overflow`, `background`, and the reveal transition — are already defined in Task 5. This step only adds the Features-specific margin/radius override, mirroring `.ben-c--shot .card-shot` but sized for this card's own padding (`28px 26px`) and corner radius (`var(--r-l)`, not `var(--r-xl)`).)

- [ ] **Step 3: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: both exit 0.

Run: `npm run dev`, scroll to "Todo incluido desde el primer día":
- All 6 cards match the same dark gradient look as Benefits.
- 5 of the 6 show a real screenshot strip; "Modo Sin Conexión" doesn't and still looks complete.

- [ ] **Step 4: Commit**

```bash
git add src/components/Features.tsx src/app/globals.css
git commit -m "feat: give Features cards a rich gradient treatment with real screenshot accents"
```

---

### Task 7: Testimonials — matching depth treatment

**Files:**
- Modify: `src/app/globals.css` only (no TSX changes — the existing `.tst-c` / `.tst-c.ft` class hooks are enough).

- [ ] **Step 1: Replace the flat card CSS with the gradient/depth treatment**

In `src/app/globals.css`, replace the entire `TESTIMONIALS` section (from `/* ═══... TESTIMONIALS ═══... */` through the line before `/* ═══... FAQ ═══... */`) with:

```css
/* ═══════════════════════════════
   TESTIMONIALS
═══════════════════════════════ */
.tst-s { background: var(--bg); }
.tst-g { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.tst-c { background: linear-gradient(155deg, var(--navy) 0%, var(--navy-h) 100%); border-radius: var(--r-xl); padding: 30px 28px 26px; display: flex; flex-direction: column; gap: 16px; transition: box-shadow .25s var(--ease), transform .25s; position: relative; overflow: hidden; box-shadow: 0 16px 48px rgba(16,43,80,.28), 0 4px 14px rgba(16,43,80,.14); }
.tst-c::before { content: '\201C'; position: absolute; top: 10px; right: 22px; font-family: var(--fh); font-size: 72px; font-weight: 800; line-height: 1; color: rgba(255,255,255,.08); pointer-events: none; user-select: none; }
.tst-c.ft::before { color: rgba(29,200,121,.22); }
.tst-c:hover { box-shadow: 0 22px 56px rgba(16,43,80,.34), 0 6px 18px rgba(16,43,80,.16); transform: translateY(-3px); }
.tst-c.ft { box-shadow: 0 16px 48px rgba(16,43,80,.28), 0 4px 14px rgba(16,43,80,.14), 0 0 0 2px var(--em); }
.tst-stars { color: #F59E0B; font-size: 14px; letter-spacing: 2px; position: relative; z-index: 1; }
.tst-q { font-size: 15px; line-height: 1.75; color: rgba(255,255,255,.9); flex: 1; position: relative; z-index: 1; }
.tst-auth { display: flex; align-items: center; gap: 12px; border-top: 1px solid rgba(255,255,255,.1); padding-top: 18px; position: relative; z-index: 1; }
.tst-av { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--fh); font-weight: 700; font-size: 14px; flex-shrink: 0; }
.tst-c.ft .tst-av { animation: pls 2.2s infinite; }
.tst-name { font-size: 14px; font-weight: 700; color: #FFF; }
.tst-biz { font-size: 12px; color: rgba(255,255,255,.55); }
```

(`.tst-c.ft .tst-av` reuses the existing `pls` keyframe already defined near the top of the file for the hero's pulsing dot — do not redefine it.)

- [ ] **Step 2: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: both exit 0.

Run: `npm run dev`, scroll to "Negocios como el tuyo ya lo están usando": all 3 cards now match the navy gradient look; the featured (Carlos González) card has a visible green ring and its avatar pulses gently.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: give Testimonials cards the same gradient depth treatment"
```

---

### Task 8: Comparison — matching depth + row-by-row reveal

**Files:**
- Modify: `src/app/globals.css` only (no TSX changes — `.cmp-tbl` already carries the `rv` class that `ScrollRevealInit` toggles to `.in` on scroll).

- [ ] **Step 1: Replace the comparison table CSS with the gradient/depth treatment and staggered row reveal**

In `src/app/globals.css`, replace the entire `COMPARISON` section (from `/* ═══... COMPARISON ═══... */` through the line before `/* ═══... TESTIMONIALS ═══... */`) with:

```css
/* ═══════════════════════════════
   COMPARISON
═══════════════════════════════ */
.cmp-s { background: var(--s1); }
.cmp-tbl { background: linear-gradient(155deg, var(--navy) 0%, var(--navy-h) 100%); border-radius: var(--r-xl); overflow: hidden; box-shadow: 0 16px 48px rgba(16,43,80,.28), 0 4px 14px rgba(16,43,80,.14); }
.cmp-hdr { display: grid; grid-template-columns: 1.3fr 1fr 1fr; }
.cmp-hc { padding: 18px 24px; font-size: 13px; font-weight: 700; text-align: center; }
.cmp-hc.feat { text-align: left; background: rgba(255,255,255,.04); color: rgba(255,255,255,.5); font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
.cmp-hc.trad { background: rgba(255,255,255,.02); color: rgba(255,255,255,.4); font-style: italic; }
.cmp-hc.mod { background: linear-gradient(155deg, var(--em), var(--em-dk)); color: var(--navy); display: flex; flex-direction: column; align-items: center; gap: 4px; }
.cmp-hc.mod small { font-size: 10px; font-weight: 500; color: rgba(16,43,80,.65); letter-spacing: .05em; }
.cmp-row { display: grid; grid-template-columns: 1.3fr 1fr 1fr; border-top: 1px solid rgba(255,255,255,.08); }
.cmp-row:hover { background: rgba(255,255,255,.03); }
.cmp-c { padding: 14px 24px; font-size: 13.5px; display: flex; align-items: center; gap: 8px; opacity: 0; transform: translateX(-8px); transition: opacity .4s var(--ease), transform .4s var(--ease); }
.cmp-tbl.in .cmp-c { opacity: 1; transform: none; }
.cmp-tbl.in .cmp-row:nth-child(1) .cmp-c.feat { transition-delay: .05s; }
.cmp-tbl.in .cmp-row:nth-child(1) .cmp-c.trad { transition-delay: .12s; }
.cmp-tbl.in .cmp-row:nth-child(1) .cmp-c.mod { transition-delay: .19s; }
.cmp-tbl.in .cmp-row:nth-child(2) .cmp-c.feat { transition-delay: .12s; }
.cmp-tbl.in .cmp-row:nth-child(2) .cmp-c.trad { transition-delay: .19s; }
.cmp-tbl.in .cmp-row:nth-child(2) .cmp-c.mod { transition-delay: .26s; }
.cmp-tbl.in .cmp-row:nth-child(3) .cmp-c.feat { transition-delay: .19s; }
.cmp-tbl.in .cmp-row:nth-child(3) .cmp-c.trad { transition-delay: .26s; }
.cmp-tbl.in .cmp-row:nth-child(3) .cmp-c.mod { transition-delay: .33s; }
.cmp-tbl.in .cmp-row:nth-child(4) .cmp-c.feat { transition-delay: .26s; }
.cmp-tbl.in .cmp-row:nth-child(4) .cmp-c.trad { transition-delay: .33s; }
.cmp-tbl.in .cmp-row:nth-child(4) .cmp-c.mod { transition-delay: .4s; }
.cmp-tbl.in .cmp-row:nth-child(5) .cmp-c.feat { transition-delay: .33s; }
.cmp-tbl.in .cmp-row:nth-child(5) .cmp-c.trad { transition-delay: .4s; }
.cmp-tbl.in .cmp-row:nth-child(5) .cmp-c.mod { transition-delay: .47s; }
.cmp-tbl.in .cmp-row:nth-child(6) .cmp-c.feat { transition-delay: .4s; }
.cmp-tbl.in .cmp-row:nth-child(6) .cmp-c.trad { transition-delay: .47s; }
.cmp-tbl.in .cmp-row:nth-child(6) .cmp-c.mod { transition-delay: .54s; }
.cmp-c.feat { color: #FFF; font-weight: 500; }
.cmp-c.trad { color: rgba(255,255,255,.4); background: rgba(0,0,0,.12); justify-content: center; text-decoration: line-through; font-size: 13px; }
.cmp-c.mod { color: var(--em); background: rgba(29,200,121,.1); justify-content: center; font-weight: 600; font-size: 13px; }
.ck { width: 17px; height: 17px; border-radius: 50%; background: var(--em); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.xk { width: 17px; height: 17px; border-radius: 50%; background: rgba(255,255,255,.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
```

Note: the `nth-child` selectors count `.cmp-row` starting at 1 for the first data row (the header `.cmp-hdr` is a sibling, not a `.cmp-row`, so this lines up correctly with the 6 rows in `ROWS` in `Comparison.tsx`). Because these are plain CSS transitions gated on the existing `.cmp-tbl.in` class (already toggled by `ScrollRevealInit.tsx` — no changes needed there), the row cascade "just works" once the table scrolls into view.

Also update `Comparison.tsx`'s `CrossIcon` stroke color for contrast against the new darker `.xk` background — in `src/components/Comparison.tsx`, change:

```tsx
<svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 2l4 4M6 2L2 6" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" /></svg>
```

to:

```tsx
<svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 2l4 4M6 2L2 6" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeLinecap="round" /></svg>
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: both exit 0.

Run: `npm run dev`, scroll to "El cuaderno ya cumplió su ciclo": the table now has a dark gradient background matching the rest of the site, and each row's feature name, then the crossed-out old way, then the green checkmark reveal in a quick left-to-right cascade as the table enters the viewport (test by reloading and scrolling down to it, not by scrolling past it first).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css src/components/Comparison.tsx
git commit -m "style: give Comparison table the gradient depth treatment with cascading row reveal"
```

---

### Task 9: CTA Final — counter + subtle depth touch

**Files:**
- Modify: `src/components/CTAFinal.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `AnimatedCounter` (Task 2).

- [ ] **Step 1: Use `AnimatedCounter` for the "500 negocios" figure**

In `src/components/CTAFinal.tsx`, add the import at the top:

```tsx
import AnimatedCounter from "@/components/AnimatedCounter";
```

Then change:

```tsx
<p>Únete a más de 500 negocios que controlan sus ventas, caja e inventario con MypiCuadre.</p>
```

to:

```tsx
<p>Únete a más de <strong><AnimatedCounter target={500} />+</strong> negocios que controlan sus ventas, caja e inventario con MypiCuadre.</p>
```

- [ ] **Step 2: Add a subtle elevated treatment to the trust row**

In `src/app/globals.css`, find:

```css
.trust-r { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
```

Replace it with:

```css
.trust-r { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 100px; padding: 14px 28px; }
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: both exit 0.

Run: `npm run dev`, scroll to the final CTA ("Tu caja cuadra desde el primer día"): the "500" in the paragraph counts up when the section scrolls into view, and the trust-items row (Sin tarjeta de crédito / Demo completa gratuita / ...) now sits inside a subtle pill-shaped panel instead of floating bare.

- [ ] **Step 4: Commit**

```bash
git add src/components/CTAFinal.tsx src/app/globals.css
git commit -m "feat: animate the CTA business count and add a subtle trust-row panel"
```

---

### Task 10: Final verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors.

- [ ] **Step 2: Manual smoke test across breakpoints**

Run: `npm run dev`, open `http://localhost:3000` and check at three widths (resize the browser or use dev tools device toolbar): ~1440px (desktop), ~800px (tablet, the `1024px` breakpoint), ~390px (mobile, the `768px`/`520px` breakpoints).

At every width, confirm:
- Hero phone shows real screenshots cycling, no layout overflow or squashing.
- Benefits/Features cards show the navy gradient look consistently; screenshot strips inside cards aren't stretched or cut off oddly.
- AppPreview phone panel shows real screenshots.
- Testimonials cards match the same visual language; the featured card's avatar pulses.
- Comparison table cascades in on scroll and reads correctly on mobile (where `.cmp-c.feat` is hidden per the existing `768px` responsive rule — confirm that rule still applies cleanly against the new dark background).
- CTA final counter animates once when scrolled into view.

- [ ] **Step 3: Reduced-motion check**

In Chrome DevTools, open the Rendering tab and set "Emulate CSS media feature prefers-reduced-motion" to `reduce`. Reload the page and confirm:
- The hero and AppPreview slideshows show only their first image with no crossfade.
- Card hover tilts, icon rotations, and the testimonial pulse no longer animate (or are instant).
- The two count-up numbers show their final value immediately instead of animating.

- [ ] **Step 4: Report**

No commit in this task (verification-only). If any check in Steps 2-3 fails, fix it as a small follow-up commit against the specific task's file(s) before considering the plan complete.
