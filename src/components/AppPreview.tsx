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
