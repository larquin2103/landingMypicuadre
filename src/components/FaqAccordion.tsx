"use client";

import { useState } from "react";

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const LEFT_COLUMN: FaqItem[] = [
  {
    id: "internet",
    q: "¿Funciona realmente sin internet?",
    a: "Sí. MypiCuadre guarda todos los datos en tu teléfono usando almacenamiento local. Puedes registrar ventas, cerrar caja y consultar inventario sin ninguna conexión. Cuando vuelve la señal, sincroniza automáticamente en segundo plano.",
  },
  {
    id: "configurar",
    q: "¿Es difícil de configurar al principio?",
    a: "No. La configuración inicial toma entre 5 y 10 minutos. Agregas el nombre de tu negocio, tus productos y el fondo de caja. Un asistente te guía paso a paso. Si tienes dudas, te ayudamos por WhatsApp en tiempo real.",
  },
  {
    id: "licencia-vence",
    q: "¿Qué pasa con mis datos si vence la licencia?",
    a: "Tus datos nunca se borran. Si la licencia vence, el sistema entra en modo lectura: consultas todo tu historial pero no puedes registrar ventas nuevas. Cuando renuevas, todo vuelve a funcionar exactamente igual.",
  },
];

const RIGHT_COLUMN: FaqItem[] = [
  {
    id: "dispositivos",
    q: "¿En qué dispositivos funciona?",
    a: "En cualquier Android o iPhone con Chrome o Safari. También en tablets y computadoras. No necesita instalarse desde Play Store ni App Store — se instala directamente desde el navegador como una PWA.",
  },
  {
    id: "costo",
    q: "¿Cuánto cuesta la licencia completa?",
    a: "La Demo es completamente gratuita con todas las funciones durante el período de prueba. La licencia completa tiene un precio accesible para negocios pequeños. Contáctanos por WhatsApp para conocer las opciones en tu país.",
  },
  {
    id: "varios-telefonos",
    q: "¿Puedo usarla en varios teléfonos?",
    a: "Sí. Puedes abrir la app en múltiples dispositivos. Cuando hay conexión, los datos se sincronizan entre todos. En modo offline, cada dispositivo opera de forma independiente y sincroniza al reconectarse.",
  },
];

export default function FaqAccordion() {
  const [openId, setOpenId] = useState<string>(LEFT_COLUMN[0].id);

  const renderColumn = (items: FaqItem[]) =>
    items.map((item, idx) => {
      const isOpen = openId === item.id;
      return (
        <div className={`faq-it${isOpen ? " open" : ""}${idx === 0 ? " first" : ""}`} key={item.id}>
          <div
            className="faq-q"
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            onClick={() => setOpenId(isOpen ? "" : item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpenId(isOpen ? "" : item.id);
              }
            }}
          >
            {item.q}
            <div className="faq-ic" aria-hidden="true">+</div>
          </div>
          <div className="faq-ans">{item.a}</div>
        </div>
      );
    });

  return (
    <div className="faq-g rv">
      <div>{renderColumn(LEFT_COLUMN)}</div>
      <div>{renderColumn(RIGHT_COLUMN)}</div>
    </div>
  );
}
