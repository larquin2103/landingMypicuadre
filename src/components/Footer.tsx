const PRODUCT_LINKS = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#app-preview", label: "Vista previa" },
  { href: "#cta", label: "Instalar Demo" },
  { href: "#precios", label: "Precios" },
];

const SUPPORT_LINKS = [
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "https://wa.me/", label: "WhatsApp" },
  { href: "#", label: "Guías de uso" },
  { href: "#", label: "Contacto" },
];

const LEGAL_LINKS = [
  { href: "#", label: "Privacidad" },
  { href: "#", label: "Términos de uso" },
  { href: "#", label: "Política de cookies" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-main">
          <div>
            <div className="foot-logo">
              <div className="foot-lm">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="8" width="4" height="8" rx="2" fill="#102B50" />
                  <rect x="8" y="4" width="4" height="12" rx="2" fill="#1DC879" />
                  <rect x="14" y="1" width="4" height="15" rx="2" fill="#1DC879" />
                  <path d="M2 16 Q8 19 14 13" stroke="#1DC879" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <span className="foot-ln">MypiCuadre</span>
            </div>
            <p className="foot-tag">El sistema de gestión para pequeños negocios latinoamericanos que funciona donde tú trabajas — con o sin internet.</p>
            <div className="foot-soc">
              <a href="#" className="foot-sb" aria-label="WhatsApp"><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8c0 1.18.31 2.3.87 3.26L1.5 14.5l3.28-.87A6.47 6.47 0 008 14.5c3.59 0 6.5-2.91 6.5-6.5S11.59 1.5 8 1.5Z" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" strokeLinejoin="round" /></svg></a>
              <a href="#" className="foot-sb" aria-label="Facebook"><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M10 2H8.5A2.5 2.5 0 006 4.5V6H4v3h2v7h3V9h2.5L12 6H9V4.5A.5.5 0 019.5 4H10V2Z" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" strokeLinejoin="round" /></svg></a>
              <a href="#" className="foot-sb" aria-label="Instagram"><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3.5" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" /><circle cx="8" cy="8" r="3" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" /><circle cx="11.5" cy="4.5" r=".75" fill="rgba(255,255,255,.45)" /></svg></a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Producto</h5>
            <ul className="foot-lks">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h5>Soporte</h5>
            <ul className="foot-lks">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h5>Legal</h5>
            <ul className="foot-lks">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <span className="foot-cp">© {new Date().getFullYear()} MypiCuadre. Todos los derechos reservados.</span>
          <div className="foot-ll"><a href="#">Privacidad</a><a href="#">Términos</a></div>
        </div>
      </div>
    </footer>
  );
}
