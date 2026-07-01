"use client";

import { useEffect, useState } from "react";

const DESKTOP_LINKS = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#funcionalidades", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
];

const MOBILE_LINKS = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#funcionalidades", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="nav" className={scrolled ? "scrolled" : ""}>
      <div className="wrap">
        <div className="nav-i">
          <a href="#" className="nav-logo">
            <div className="nav-lm">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="8" width="4" height="8" rx="2" fill="#F5F8FA" />
                <rect x="8" y="4" width="4" height="12" rx="2" fill="#1DC879" />
                <rect x="14" y="1" width="4" height="15" rx="2" fill="#1DC879" />
                <path d="M2 16 Q8 19 14 13" stroke="#1DC879" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="nav-ln">MypiCuadre</span>
          </a>
          <ul className="nav-links">
            {DESKTOP_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-acts">
            <a href="#" className="nav-login">Iniciar sesión</a>
            <a href="#cta" className="btn btn-em btn-sm">Instalar Demo</a>
          </div>
          <button
            className={`hbg${menuOpen ? " open" : ""}`}
            aria-label="Menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div className={`mob-menu${menuOpen ? " open" : ""}`}>
        {MOBILE_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <a
          href="#"
          style={{ color: "var(--t2)", fontSize: "15px", fontWeight: 500, padding: "10px 12px", borderRadius: "var(--r-s)" }}
          onClick={() => setMenuOpen(false)}
        >
          Iniciar sesión
        </a>
        <a href="#cta" className="btn btn-em" onClick={() => setMenuOpen(false)}>
          Instalar Demo gratis
        </a>
      </div>
    </nav>
  );
}
