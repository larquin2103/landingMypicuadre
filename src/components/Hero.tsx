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
