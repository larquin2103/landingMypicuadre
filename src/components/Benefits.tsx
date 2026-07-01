const BENEFITS = [
  {
    iconBg: "var(--navy)",
    title: "Sin internet, sin problemas",
    text: "Trabaja completamente offline. Guarda cada venta en tu teléfono. Cuando regresa la señal, sincroniza todo solo.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="7.5" stroke="#F5F8FA" strokeWidth="1.7" /><path d="M7.5 11h7M11 7.5v7" stroke="var(--em)" strokeWidth="1.7" strokeLinecap="round" /><circle cx="11" cy="11" r="2" fill="#F5F8FA" /></svg>
    ),
  },
  {
    iconBg: "var(--navy)",
    title: "Ventas en segundos",
    text: "Busca el producto, indica la cantidad, acepta el pago. El stock y la caja se actualizan en el momento.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="12" rx="2" stroke="#F5F8FA" strokeWidth="1.7" /><path d="M3 8h16" stroke="#F5F8FA" strokeWidth="1.7" opacity=".4" /><path d="M7 12h8" stroke="var(--em)" strokeWidth="1.7" strokeLinecap="round" /></svg>
    ),
  },
  {
    iconBg: "var(--em)",
    title: "Caja que siempre cuadra",
    text: "Abre y cierra turnos con un toque. El cuadre automático detecta diferencias al instante y las registra.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="4" width="14" height="14" rx="2" stroke="var(--navy)" strokeWidth="1.7" /><path d="M8 11l2.5 2.5L15 8" stroke="var(--navy)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
  {
    iconBg: "var(--navy)",
    title: "Reportes instantáneos",
    text: "Ventas del día, semana o mes. Productos más vendidos. Todo en pantalla o exportado a PDF con un toque.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 16V9M10 16V4M15 16v-6" stroke="#F5F8FA" strokeWidth="1.7" strokeLinecap="round" /><path d="M5 9l3 3" stroke="var(--em)" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
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
            <div className="ben-c rv" key={b.title}>
              <div className="ben-ico" style={{ background: b.iconBg }}>{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
