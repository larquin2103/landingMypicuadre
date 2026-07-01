const PREVIEW_FEATURES = [
  "Resumen de ventas en tiempo real",
  "Búsqueda rápida de productos por nombre",
  "Cuadre automático al cerrar turno",
  "Alertas de stock bajo configurables",
  "Exportación a PDF sin configuración",
];

const INVENTORY_ROWS = [
  { name: "Café molido 250g", stock: 48, stockColor: "var(--em)", price: "$25.00" },
  { name: "Azúcar refino 1kg", stock: 5, stockColor: "var(--warn)", price: "$18.00" },
  { name: "Aceite girasol 1L", stock: 22, stockColor: "var(--em)", price: "$55.00" },
  { name: "Ron Añejo 700ml", stock: 1, stockColor: "var(--err)", price: "$120.00" },
  { name: "Jabón de tocador", stock: 34, stockColor: "var(--em)", price: "$12.00" },
  { name: "Arroz largo 1kg", stock: 60, stockColor: "var(--em)", price: "$22.00" },
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
            <div className="prev-screen">
              <div className="prev-screen-hd">
                <div><div className="prev-screen-ttl">Inventario</div><div className="prev-screen-sub">24 productos · actualizado ahora</div></div>
                <div className="prev-screen-btn">+ Agregar</div>
              </div>
              <div className="prev-tbl">
                <div className="prev-tbl-hd">
                  <div className="prev-tbl-hl">Producto</div>
                  <div className="prev-tbl-hl">Stock</div>
                  <div className="prev-tbl-hl">Precio</div>
                </div>
                {INVENTORY_ROWS.map((row) => (
                  <div className="prev-row" key={row.name}>
                    <span className="prev-pn">{row.name}</span>
                    <span className="prev-ps" style={{ color: row.stockColor }}>{row.stock}</span>
                    <span className="prev-pp">{row.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
