const TESTIMONIALS = [
  {
    featured: false,
    quote: "Antes perdía media hora haciendo el cuadre a mano. Ahora toco un botón y listo. La diferencia siempre me da cero y eso me da una tranquilidad enorme al cerrar.",
    initials: "MR",
    avatarBg: "var(--em-t)",
    avatarColor: "var(--em-dk)",
    name: "María Rodríguez",
    business: "Bodega · La Habana",
  },
  {
    featured: true,
    quote: "Lo que más me gustó es que funciona sin internet. En mi barrio la señal es irregular y nunca falla. Mis empleados llevan sus turnos solos y yo veo todo desde el mío.",
    initials: "CG",
    avatarBg: "var(--navy-t)",
    avatarColor: "var(--navy)",
    name: "Carlos González",
    business: "Cafetería · Santiago de Cuba",
  },
  {
    featured: false,
    quote: "Tengo el inventario siempre al día sin contarlo manualmente. Cuando algo baja de 5 unidades me avisa. Eso solo ya valió la pena. Y el reporte de ventas del mes, increíble.",
    initials: "AL",
    avatarBg: "#F0EDE8",
    avatarColor: "var(--t2)",
    name: "Ana López",
    business: "Abarrotes · Camagüey",
  },
];

export default function Testimonials() {
  return (
    <section className="tst-s sp">
      <div className="wrap">
        <div className="sh rv">
          <span className="ey">Testimonios</span>
          <h2>Negocios como el tuyo<br />ya lo están usando</h2>
          <p>Más de 500 comercios en América Latina confían su operación diaria a MypiCuadre.</p>
        </div>
        <div className="tst-g">
          {TESTIMONIALS.map((t) => (
            <div className={`tst-c${t.featured ? " ft" : ""} rv`} key={t.name}>
              <div className="tst-stars">★★★★★</div>
              <p className="tst-q">&quot;{t.quote}&quot;</p>
              <div className="tst-auth">
                <div className="tst-av" style={{ background: t.avatarBg, color: t.avatarColor }}>{t.initials}</div>
                <div><div className="tst-name">{t.name}</div><div className="tst-biz">{t.business}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
