const ROWS = [
  { feature: "Funciona sin internet", traditional: "Solo manual", modern: "100% offline" },
  { feature: "Cuadre de caja automático", traditional: "Manual con errores", modern: "Automático al cierre" },
  { feature: "Reportes de ventas", traditional: "Sumar a mano", modern: "Instantáneos, exportables" },
  { feature: "Control de inventario", traditional: "Conteo físico manual", modern: "Se actualiza con cada venta" },
  { feature: "Gestión de turnos", traditional: "Sin control real", modern: "Turnos independientes" },
  { feature: "Seguridad de los datos", traditional: "Si se pierde, se pierde", modern: "Respaldo automático" },
];

function CrossIcon() {
  return (
    <div className="xk">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 2l4 4M6 2L2 6" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" /></svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="ck">
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5 7.5 2.5" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

export default function Comparison() {
  return (
    <section className="cmp-s sp" id="precios">
      <div className="wrap">
        <div className="sh rv">
          <span className="ey">Por qué cambiar</span>
          <h2>El cuaderno ya cumplió su ciclo</h2>
          <p>MypiCuadre hace lo que el cuaderno nunca pudo, sin complicar lo que ya funciona.</p>
        </div>
        <div className="cmp-tbl rv">
          <div className="cmp-hdr">
            <div className="cmp-hc feat">Característica</div>
            <div className="cmp-hc trad">Cuaderno / Planilla</div>
            <div className="cmp-hc mod">MypiCuadre<small>Incluido en todos los planes</small></div>
          </div>
          {ROWS.map((row) => (
            <div className="cmp-row" key={row.feature}>
              <div className="cmp-c feat">{row.feature}</div>
              <div className="cmp-c trad"><CrossIcon />{row.traditional}</div>
              <div className="cmp-c mod"><CheckIcon />{row.modern}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "36px" }} className="rv">
          <a href="#cta" className="btn btn-em btn-lg">Probar gratis hoy</a>
        </div>
      </div>
    </section>
  );
}
