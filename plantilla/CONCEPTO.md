# Concepto

## Para qué sirve

Lo que no se define lo pone la herramienta: la tipografía, el color, el tono
de un error. Esta hoja deja esas decisiones escritas antes de construir, y
después las siguen las personas y los agentes.

Se completa entre todos en **45 a 60 minutos**, antes de escribir la primera
spec. Tiempo sugerido por bloque: pausa 5, principios 10, problema 10,
360 10, recursos 10, explorar 10 a 15.

## 1. Pausa

Antes de abrir el editor, 5 minutos para leer las reglas del evento y el
problema.

- Lo que pide el problema, en una línea: <completar>
- Lo que no podemos romper (reglas, plazos, restricciones): <completar>

## 2. Principios, valores y atributos

De 3 a 5 principios, una línea cada uno ("preferimos X a Y"):

1. Preferimos <X> a <Y>.
2. Preferimos <X> a <Y>.
3. Preferimos <X> a <Y>.

Valores del producto: <completar>

De 3 a 5 atributos de personalidad (cómo se siente usarlo): <completar>

## 3. Problema y emoción

- A quién le pasa: <completar>
- Qué hace hoy: <completar>
- Qué siente antes: <completar>
- Qué queremos que sienta después: <completar>

## 4. 360

Producto, marca y comunicación juntos: nada queda para "después".

| capa | qué decidimos |
|---|---|
| producto | <completar> |
| marca | <completar> |
| comunicación | <completar> |
| mensajes de éxito | <completar> |
| mensajes de error | <completar> |
| estados vacíos y de carga | <completar> |
| sonido | <completar> |
| tacto o movimiento | <completar> |
| wow moment | <completar> |

## 5. Recursos con intención

El `por qué` es obligatorio: qué principio o atributo justifica la decisión.
Un recurso sin intención se reemplaza por uno con intención o se saca.

| recurso | decisión | por qué |
|---|---|---|
| tipografía | <completar> | <principio o atributo> |
| tamaños | <completar> | <principio o atributo> |
| color | <completar> | <principio o atributo> |
| iconografía | <completar> | <principio o atributo> |
| strokes | <completar> | <principio o atributo> |
| radios | <completar> | <principio o atributo> |
| espaciados | <completar> | <principio o atributo> |
| sombras | <completar> | <principio o atributo> |
| imagen | <completar> | <principio o atributo> |

Coherencia antes que consistencia rígida: un recurso puede romper el patrón
si lo justifica un principio, y se anota en la tabla.

## 6. Explorar en Figma con referencias

1. Juntar de 3 a 6 imágenes de referencia
   (ver `docs/referencias.md`).
2. Armar en Figma (o FigJam) un tablero con las referencias, los atributos y
   la tabla de recursos. Si alguien no tiene Figma, vale cualquier tablero
   compartido.
3. Probar 2 o 3 direcciones visuales y elegir una contra los principios.
4. Las referencias dan intención y ritmo; nunca se copia marca, textos ni
   colores.

Link del tablero: <completar>
Dirección elegida y por qué: <completar>

## 7. Cierre y uso

Cuatro hábitos para el resto del trabajo:

- **Observar:** usarlo como lo usaría el jurado o quien lo recibe.
- **Obsesionarse con el detalle** de lo que se muestra.
- **Priorizar:** el detalle va al camino de la demo, no a todo.
- **Divertirse.**

Cómo se usa después: cada spec de `specs/` cita en `Notas` los principios
que aplica, y en cada revisión de PR se mira la tabla de recursos.

Ejemplo corto (proyecto inventado: una app para repartir gastos de piso):

- Principio: preferimos claridad a ingenio.
- Atributo: tranquilo.
- Fila 360: mensajes de error | dicen qué pasó y qué hacer, sin culpar.
- Fila de recursos: radios | 12 px en tarjetas, 999 en botones | tranquilo:
  nada filoso; el botón principal rompe el patrón a propósito (claridad).
