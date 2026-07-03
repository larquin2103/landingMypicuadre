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
