import FaqAccordion from "@/components/FaqAccordion";

export default function FAQ() {
  return (
    <section className="faq-s sp" id="faq">
      <div className="wrap">
        <div className="sh rv">
          <span className="ey">Preguntas frecuentes</span>
          <h2>Resolvemos tus dudas</h2>
          <p>Si no encuentras lo que buscas, escríbenos por WhatsApp y respondemos en menos de 2 horas.</p>
        </div>
        <FaqAccordion />
        <div className="faq-wa rv">
          <div>
            <h4>¿Tienes otra pregunta?</h4>
            <p>Respuesta garantizada en menos de 2 horas por WhatsApp.</p>
          </div>
          <a href="https://wa.me/" className="btn btn-em" style={{ flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8c0 1.18.31 2.3.87 3.26L1.5 14.5l3.28-.87A6.47 6.47 0 008 14.5c3.59 0 6.5-2.91 6.5-6.5S11.59 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
