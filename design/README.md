# Guía de diseño

Cómo se ve [Nombre]: un amanecer sobre los Andes, con el Sol de Mayo, azul
marino y crema. Cálido y argentino, pero serio: es crédito, no un juego.

La referencia es el diseño **C · Amanecer** del archivo
`expandir-hackatwin.pen` (se abre con pen.dev). Capturas en `referencias/`.

| Archivo | Qué es |
|---|---|
| `expandir-hackatwin.pen` | Diseños A, B y C. El elegido es C (desktop y mobile) |
| `referencias/c-amanecer-desktop.jpg` | Landing C completa, 1440 px |
| `referencias/c-amanecer-mobile.jpg` | Landing C completa, 390 px |
| `assets/sol-de-mayo.png` | Sol de Mayo grabado, fondo transparente, 840 px |
| `assets/andes.png` | Cordillera en capas, fondo transparente, 2880 px de ancho |
| `images/tokens/*.png` | Logos de las 7 monedas de Twin (copia de los SVG oficiales) |

## Principios

1. **Una acción por pantalla.** El botón principal es lo más visible. En fondo
   oscuro es amarillo sol; en fondo claro, azul marino.
2. **El paisaje cuenta la historia.** El sol y los Andes aparecen en el hero y
   en el cierre, nunca de relleno en el medio.
3. **Números a la vista y marcados.** Todo número de ejemplo dice
   "ilustrativo".
4. **Ritmo claro / oscuro.** Las secciones alternan crema, papel y azul
   profundo. Nunca dos oscuras seguidas.
5. **Pocas cajas.** Una tarjeta solo cuando agrupa algo que se usa junto.

## Color

| Token | Hex | Uso |
|---|---|---|
| `navy` | `#262F63` | Texto principal, botón primario en fondo claro |
| `navy-deep` | `#1B2250` | Secciones oscuras, footer, cielo del hero |
| `ink-2` | `#545C86` | Texto secundario sobre crema o papel |
| `cream` | `#F4EEE3` | Fondo base |
| `cream-2` | `#ECE3D3` | Fondo de chips y pistas de progreso |
| `paper` | `#FBF8F2` | Tarjetas y secciones alternas |
| `line` | `#D9D0BF` | Bordes y separadores |
| `sun` | `#F2AE2E` | Botón en fondo oscuro, acentos, el sol |
| `sun-soft` | `#F8D995` | Brillo detrás del sol |
| `sun-ink` | `#94601A` | Etiquetas (eyebrows) sobre crema o papel |
| `lavender` | `#8C98C8` | Montañas, números decorativos grandes |
| `lavender-soft` | `#C9CFE8` | Texto secundario sobre azul profundo |
| `live` | `#2FBF71` | Punto de "en vivo" |

Contraste medido (WCAG AA pide 4,5 para texto chico):

| Texto / fondo | Ratio | |
|---|---|---|
| `navy` / `cream` | 10,9 | ok |
| `ink-2` / `cream` | 5,6 | ok |
| `sun-ink` / `cream` | 4,6 | ok |
| blanco / `navy` | 12,6 | ok |
| `lavender-soft` / `navy-deep` | 9,8 | ok |
| `navy-deep` / `sun` | 7,8 | ok (texto del botón amarillo) |
| `sun` / `cream` | 1,7 | **nunca texto**: solo íconos, bordes o el sol |
| `lavender` / `cream` | 2,4 | **nunca texto chico**: solo números de 40 px o más |

### Degradado del hero (amanecer)

De arriba hacia abajo: `#161C45` 0% · `#2B3470` 45% · `#8A7FA6` 70% ·
`#F3C98A` 90% · `#F6DDB0` 100%. Detrás del sol, un brillo radial
`#FFD98A` al 80% que se desvanece a 0.

El cierre usa la versión clara: `#F4EEE3` → `#F3DFC2`.

## Tipografía

Una sola familia: **Montserrat** (Google Fonts). Pesos 300, 400, 500, 600, 700.
Para hashes y direcciones onchain: **JetBrains Mono**.

| Estilo | Desktop | Mobile | Peso | Interlineado | Tracking |
|---|---|---|---|---|---|
| Titular hero | 68 | 38 | 600 | 1,06 | -1,8 / -1 |
| Título de sección | 44 | 30 | 600 | 1,1 | -1 / -0,6 |
| Título de tarjeta | 22 | 18 | 600 | 1,25 | 0 |
| Bajada del hero | 23 | 17 | 500 | 1,45 | 0 |
| Cuerpo grande | 18 | 16 | 400 | 1,5 | 0 |
| Cuerpo | 16 | 15 | 400 | 1,5 | 0 |
| Chico / notas | 14 | 13 | 400 | 1,4 | 0 |
| Eyebrow | 13 | 12 | 600, MAYÚSCULAS | 1 | +2 |
| Número decorativo | 64 | 44 | 300 | 1 | 0 |

Reglas: nada de cuerpo debajo de 14 px en desktop. Centrado solo en el hero,
el cierre y títulos cortos; más de 3 líneas van alineadas a la izquierda.

## Espaciado y forma

- **Ancho:** desktop 1440 con márgenes de 96; contenido de lectura hasta
  1040. Mobile 390 con márgenes de 24.
- **Secciones:** 120 arriba y abajo en desktop, 72 en mobile.
- **Escala de gaps:** 8 · 10 · 14 · 16 · 24 · 32 · 48 · 72 · 80.
- **Radios:** botones, chips y pills 999 (redondos). Tarjetas 20 a 24.
  Inputs 14. Fotos 18 a 20.
- **Sombra de tarjeta:** y 20, blur 50, `navy-deep` al 10%. Solo en tarjetas
  que flotan sobre otra cosa (resultado, ticket).
- **Brillo del botón amarillo:** y 10, blur 30, `sun` al 35%.

## Componentes

| Componente | Cómo es |
|---|---|
| Botón primario | Pill, padding 18 × 34, texto 17/700 + flecha `arrow-right`. Amarillo sobre oscuro, navy sobre claro |
| Botón secundario | Pill con borde 1,5 px, sin relleno |
| Pill de moneda | Logo de 30 a 44 px + etiqueta chica + monto en 700. Fondo blanco al 8% con borde blanco al 20% sobre oscuro |
| Chip de país | Pill con logo de 18 a 22 px + nombre. Seleccionado: fondo `sun`, texto `navy-deep` |
| Eyebrow | Texto en mayúsculas sobre el título de cada sección, color `sun-ink` (o `sun` sobre oscuro) |
| Tarjeta de paso | Número grande liviano, ícono arriba a la derecha, título y descripción. El último paso va en `navy` |
| Tabla comparativa | "Hoy" con ✗ rojo `#B5524A`, "Con [Nombre]" con ✓ verde `#2E8B57`. Todas las celdas de una fila con la misma altura. En mobile, una tarjeta por fila |
| Tarjeta de resultado | Papel, monto grande en 700, lista con separadores y botón al pie, nota "ilustrativo" |
| Ticket de ejemplo | Cabecera navy con ciudad + moneda a cada lado, filas clave / valor |
| Matriz de monedas | 7 × 7 logos, diagonal vacía: los 42 pares. La ruta del ejemplo resaltada en `navy` con punto `sun` |

Íconos: **Lucide**, trazo por defecto, 18 a 26 px.

## Imágenes

- **Sol de Mayo** (`assets/sol-de-mayo.png`): estilo grabado de billete. Un
  solo sol por pantalla, saliendo detrás de los Andes. No recolorear ni girar.
- **Andes** (`assets/andes.png`): siempre al borde inferior y a todo el
  ancho. En mobile se recorta, no se achica.
- **Estrellas:** puntos blancos de 2 a 3 px al 70% en el cielo oscuro. Pocos.
- **Monedas:** logos oficiales de Twin,
  `https://assets.twin.finance/media/tokens/32x32/<TICKER>.svg`. En la web
  usá el SVG; los PNG de `images/tokens/` son para pen.dev.
- **Fotos:** escenas reales y cálidas del negocio funcionando (local, gente,
  luz de mañana). Si llevan texto encima, con capa `navy-deep` en degradado.

## Voz y textos

- Español rioplatense, voseo, frases cortas: "Calculá tu préstamo".
- **Sin promesas de rendimiento ni intereses sobre ARGt.** Se habla de
  "comisión del préstamo".
- "Construido con las monedas de Twin". Nunca "socios de Twin".
- Ejemplos y números marcados como **ilustrativos**.
- El nombre del producto sigue siendo `[Nombre]` hasta que se defina.
- Footer: "Proyecto de HackaTwin 2026, equipo Mixto C".

## Para el código

Variables CSS listas para copiar:

```css
:root {
  --navy: #262F63;
  --navy-deep: #1B2250;
  --ink-2: #545C86;
  --cream: #F4EEE3;
  --cream-2: #ECE3D3;
  --paper: #FBF8F2;
  --line: #D9D0BF;
  --sun: #F2AE2E;
  --sun-soft: #F8D995;
  --sun-ink: #94601A;
  --lavender: #8C98C8;
  --lavender-soft: #C9CFE8;
  --live: #2FBF71;
  --font-sans: "Montserrat", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

Con Tailwind v4, los mismos valores en `@theme` (`--color-navy`,
`--color-sun`, etc.) generan clases como `bg-navy` y `text-sun-ink`.

Responsive: se diseña primero en 390 px. Desde 1024 px pasa al layout de
dos columnas del desktop.

## Antes de dar algo por terminado

- [ ] Ningún texto chico en `sun` o `lavender` sobre crema.
- [ ] Un solo botón primario visible por pantalla.
- [ ] Todo número de ejemplo dice "ilustrativo".
- [ ] Nada se corta en 390 px.
- [ ] Ninguna frase promete rendimiento ni dice que somos socios de Twin.
