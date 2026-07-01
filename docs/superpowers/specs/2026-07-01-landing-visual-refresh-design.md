# Rediseño visual de la landing de MypiCuadre

**Fecha:** 2026-07-01
**Estado:** Aprobado para pasar a plan de implementación

## Contexto y problema

La landing actual (implementada en `src/components/*`) ya usa la paleta de marca (navy `#102B50` + verde esmeralda `#1DC879`, tipografías Bricolage Grotesque / Plus Jakarta Sans / JetBrains Mono) heredada del handoff de Claude Design. Sin embargo, el usuario la percibe como "genérica" en conjunto: tarjetas planas (ícono + texto, sin profundidad), animaciones limitadas a fade-in, y un mockup de teléfono dibujado enteramente con `<div>`s en vez de contenido real de la aplicación.

Durante el brainstorming se confirmó:
- **La paleta de color se mantiene sin cambios.** El problema no es el color, es la ejecución.
- El usuario tiene **15 capturas reales de la app** (en `public/app-media/`), pero **no video** todavía.
- Se aprobó un tratamiento de tarjeta "con profundidad" (gradiente navy, sombra en capas, ícono con relieve, recorte de captura real cuando aplica) sobre el tratamiento plano actual.
- El alcance del rediseño de tarjetas cubre **todo el sitio** (Benefits, Features, Testimonials, Comparison, CTA), no solo Benefits/Features.
- El Hero debe usar un **carrusel animado de capturas reales** en vez del mockup dibujado, diseñado para poder swapearse por video real más adelante sin rehacer el layout.

## Inventario de capturas disponibles

Ubicadas en `public/app-media/`, todas con la paleta de marca ya aplicada (fondo navy `#0B1A2E`/`#102B50`, acentos verdes):

| Archivo | Contenido |
|---|---|
| `Screenshot_20260628_083805.jpg` | Turno activo — caja del turno (fondo, ventas, esperado), botón "Registrar venta" |
| `Screenshot_20260628_083842.jpg` | Cerrar turno — paso 1 "Conteo físico" |
| `Screenshot_20260628_083924.jpg` | Conteo físico por categoría (Carnes, Aceites, Granos) |
| `Screenshot_20260628_083951.jpg` | Cerrar turno — paso 3 "Cuadre", conteo por denominación MN/USD |
| `Screenshot_20260628_085235.jpg` | Login con PIN (Administrador) |
| `Screenshot_20260628_085305.jpg` | Panel del dueño — ventas netas, métodos de pago (gráfico dona), tendencia |
| `Screenshot_20260628_085332.jpg` | Auditoría — historial inmutable por rango de fechas |
| `Screenshot_20260628_085353.jpg` | Reportes — exportación Excel/PDF por rango |
| `Screenshot_20260628_131854.jpg` | Login con PIN (Vendedor-A) |
| `Screenshot_20260628_131914.jpg` | Home vendedor — turno abierto, catálogo, tasas vigentes |
| `Screenshot_20260628_131946.jpg` | Ventas del turno — detalle de ventas registradas |
| `Screenshot_20260628_133414.jpg` | Conteo físico — ajuste de existencias con motivo |
| `Screenshot_20260628_133510.jpg` | Catálogo — listado de productos con stock y precio |
| `Screenshot_20260628_133532.jpg` | Nuevo producto — formulario de alta |
| `Screenshot_20260628_133551.jpg` | Cambiar precio — historial de precios |

No hay video; el diseño se construye para admitir uno más adelante sin cambios estructurales (ver "Componente de medio de la app").

## Componente de medio de la app (pieza compartida)

Se introduce un componente reutilizable, p.ej. `AppMediaFrame`, que envuelve el chrome de teléfono ya existente (`.mock-device`, bordes redondeados, sombra, animación `float`) y en su interior muestra **uno de dos modos**:

- **`slides`**: rota entre 2-3 imágenes reales (`next/image`, prioridad en la primera) con crossfade cada ~3.5s, pausable en hover/focus y respetando `prefers-reduced-motion` (sin rotación, muestra la primera imagen fija).
- **`video`**: reproduce un `<video autoPlay muted loop playsInline>` — no se implementa aún porque no hay archivo, pero la interfaz del componente ya acepta esta variante para no rehacer el layout cuando llegue.

Se usa en dos lugares con distinto set de imágenes:
- **Hero** (`hero-mock`): Panel del dueño → Turno activo → Cuadre.
- **AppPreview** (`prev-screen`, hoy la tabla de inventario dibujada): Catálogo → Cuadre → Reportes, con una cadencia algo más lenta (~4.5s) ya que acompaña texto de lectura.

Las tarjetas flotantes del Hero (`fc-ok`, `fc-of`) se mantienen pero su copy pasa a ser agnóstico de la imagen visible en un momento dado (p.ej. "Auditoría 100% trazable", "Sin WiFi · Datos guardados") para que nunca contradigan la captura mostrada.

## Tratamiento de tarjeta "con profundidad"

Nueva variante de tarjeta (aplica a `.ben-c`, `.feat-c`, `.tst-c`, y ajustes equivalentes en `.cmp-tbl`/`.cta-f`) que reemplaza el fondo plano `var(--bg)` + borde `var(--bd)` por:
- Fondo `linear-gradient(155deg, var(--navy) 0%, var(--navy-h) 100%)`.
- Sombra en capas (`0 16px 48px rgba(16,43,80,.28), 0 4px 14px rgba(16,43,80,.14)`), con halo radial verde sutil en una esquina (`::before`).
- Ícono en contenedor con relieve: `linear-gradient(155deg, var(--em), var(--em-dk))`, sombra + `inset` highlight.
- Texto en blanco/blanco translúcido en vez de `var(--t1)`/`var(--t2)`.
- **Cuando la tarjeta tiene una captura real asociada**: franja inferior (`.card-shot`) con un recorte recortado/escalado de la zona relevante de la captura (vía `next/image` con `object-position` ajustado), separada del cuerpo por el propio fondo oscuro de la captura.

Mapeo tarjeta → captura:

| Sección | Tarjeta | Captura |
|---|---|---|
| Benefits | Sin internet, sin problemas | *(sin captura, solo ícono)* |
| Benefits | Ventas en segundos | Ventas del turno (`131946`) |
| Benefits | Caja que siempre cuadra | Cuadre (`083951`) |
| Benefits | Reportes instantáneos | Reportes (`085353`) |
| Features | Punto de Venta | Turno activo / Registrar venta (`083805`) |
| Features | Control de Caja | Cerrar turno / Cuadre (`083842`) |
| Features | Inventario | Catálogo (`133510`) |
| Features | Gestión de Turnos | Home vendedor / turno abierto (`131914`) |
| Features | Reportes y Analytics | Panel del dueño / gráfico (`085305`) |
| Features | Modo Sin Conexión | *(sin captura, solo ícono)* |

Testimonials, Comparison y CTA reciben el mismo lenguaje visual (gradiente + sombra en capas + acentos) pero **sin** franja de captura — su contenido ya es texto/tabla y no se fuerza una imagen donde no aporta.

## Animación

**Scroll storytelling** (se extiende `ScrollRevealInit.tsx`, hoy solo agrega `.in` con delay escalonado):
- Tarjetas con captura: el texto revela primero (como hoy) y la franja de captura hace un reveal adicional (translateY + clip) ~120ms después, dando sensación de "armado" en dos tiempos en vez de un solo fade.
- Fila de comparación (`.cmp-row`): revela feature → ✗ → ✓ en cascada dentro de la misma fila al entrar en viewport, en vez de aparecer completa de golpe.
- Contadores: el patrón ya usado en `AnimatedSalesValue` (cuenta hacia arriba) se reutiliza para "+500 negocios activos" en el hero-trust y en el CTA final, activado por `IntersectionObserver` en vez de solo al cargar.

**Micro-interacciones**:
- Tarjetas: hover añade inclinación 3D leve (`perspective` + rotación según posición del cursor) sumada al `translateY` que ya existe.
- Íconos: rebote/rotación sutil al hover de la tarjeta contenedora.
- Testimonio destacado (`.tst-c.ft`): halo verde con pulso suave (reutiliza keyframe `pls` ya existente en `globals.css`).

Todo lo anterior respeta el bloque `@media (prefers-reduced-motion: reduce)` ya presente en `globals.css`, extendiéndolo a las nuevas clases.

## Fuera de alcance

- No se toca `Navbar`, `Footer`, `FAQ` (ya tienen un tratamiento adecuado y no fueron señalados como "genéricos").
- No se produce ni edita video — el componente queda listo para aceptarlo, pero la entrega actual usa únicamente las 15 capturas existentes.
- No se cambia paleta de color, tipografía ni copy existente salvo los ajustes puntuales de las tarjetas flotantes del Hero mencionados arriba.

## Consideraciones técnicas para el plan de implementación

- El proyecto usa Next.js 16 (`AGENTS.md` advierte que esta versión tiene cambios respecto al conocimiento de entrenamiento). Antes de implementar el uso de `next/image` con imágenes locales y el manejo de assets estáticos, el plan de implementación debe revisar `node_modules/next/dist/docs/` para confirmar la API vigente en esta versión en vez de asumir comportamiento de versiones anteriores.
- Las 15 capturas en `public/app-media/` deben recortarse/optimizarse a un aspecto consistente entre sí antes o durante la implementación para que encajen sin distorsión dentro del chrome de teléfono existente.
