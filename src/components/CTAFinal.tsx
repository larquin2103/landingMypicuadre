const TRUST_ITEMS = [
  "Sin tarjeta de crédito",
  "Demo completa gratuita",
  "Funciona sin internet",
  "Soporte por WhatsApp",
];

function TrustCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

export default function CTAFinal() {
  return (
    <section className="cta-f">
      <div className="wrap">
        <div className="cta-f-i">
          <span className="ey ey-light">Empieza hoy</span>
          <h2>Tu caja cuadra desde<br />el primer día</h2>
          <p>Únete a más de 500 negocios que controlan sus ventas, caja e inventario con MypiCuadre.</p>
          <div className="cta-acts">
            <a href="#cta" className="btn btn-em btn-lg">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5v8M7.5 9.5l-3-3M7.5 9.5l3-3M1.5 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Instalar Demo gratis
            </a>
            <a href="https://wa.me/" className="btn btn-od btn-lg">Hablar con un asesor</a>
          </div>
          <div className="trust-r">
            {TRUST_ITEMS.map((item) => (
              <div className="trust-it" key={item}><TrustCheckIcon />{item}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
