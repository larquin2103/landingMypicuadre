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
