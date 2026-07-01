const STEPS = [
  {
    number: "01",
    active: false,
    title: "Instala la app",
    text: 'Abre el enlace en Chrome o Safari. Toca "Añadir a inicio". Listo — sin tienda de apps, sin permisos complicados.',
  },
  {
    number: "02",
    active: true,
    title: "Configura tu negocio",
    text: "Agrega el nombre, tus productos con precios y el fondo de caja inicial. El asistente te guía en cada paso.",
  },
  {
    number: "03",
    active: false,
    title: "Registra ventas",
    text: "Busca el producto, indica la cantidad, acepta el pago. Stock e inventario se actualizan en el momento.",
  },
  {
    number: "04",
    active: false,
    title: "Controla todo",
    text: "Al cierre del turno ve cuánto vendiste, si la caja cuadra y qué productos necesitas reponer mañana.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-s sp" id="como-funciona">
      <div className="wrap">
        <div className="sh rv">
          <span className="ey">Cómo funciona</span>
          <h2>En menos de 10 minutos tu<br />negocio está operando</h2>
          <p>Sin instaladores, sin servidores, sin cursos. Solo tu teléfono y las ganas de tener todo en orden.</p>
        </div>
        <div className="steps">
          {STEPS.map((step) => (
            <div className="step rv" key={step.number}>
              <div className={`step-n${step.active ? " active" : ""}`}>{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }} className="rv">
          <a href="#cta" className="btn btn-em btn-lg">Comenzar ahora · Es gratis</a>
        </div>
      </div>
    </section>
  );
}
