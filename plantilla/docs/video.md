# Video de la demo con Claude Motion

El video se hace en **Claude Motion** a partir de un video de referencia. El
método tiene cuatro pasos, en este orden. No te saltees el 2: es el que
evita que el resultado parezca genérico.

## 1. Elegir un video de referencia

Buscá en https://launchvideos.gallery un video de lanzamiento cuyo **ritmo y
transiciones** te gusten (no su tema). Uno solo: mezclar referencias da un
resultado sin estilo.

## 2. Ficha de tomas, cuadro por cuadro

Pasale el video a un agente y pedile que lo analice cuadro por cuadro y
complete esta **ficha de tomas**. Revisala vos: si una fila no se entiende,
el brief va a salir mal.

| toma | inicio | duracion | que se ve | transicion | que se transforma |
|---|---|---|---|---|---|
| 1 | 0:00 | 1,5 s | <qué hay en pantalla> | <corte, morph, zoom, barrido…> | <qué elemento pasa a ser otro> |
| 2 | 0:01,5 | 2 s | | | |
| … | | | | | |

Agregá al final: duración total, cantidad de tomas, ritmo (tomas por
segundo), paleta en palabras (no los colores exactos) y cómo cierra.

## 3. Brief de alto nivel para Claude Motion

No escribas cada escena a mano: dale a Motion un brief de alto nivel y dejá
que proponga. Plantilla:

```text
Video de lanzamiento de <proyecto>, <duración> segundos, 16:9.

Qué es: <una línea del README>.
Beats (en orden):
1. <el problema, en una imagen>
2. <el producto aparece>
3. <el flujo real de la demo: pantalla X -> acción -> resultado>
4. <el momento wow>
5. Cierre con el logo de <proyecto>, que queda fijo como último cuadro.

Ritmo y transiciones: tomados de esta ficha de tomas <pegar la ficha>.
Transiciones que se transforman: cada toma sale de un elemento de la
anterior (una tarjeta pasa a ser la pantalla siguiente, un número pasa a
ser el gráfico). Ritmo rápido.
Movimiento suave: sin saltos de cámara, sin springs, sin loop.
Look: <dos o tres palabras>. Colores y tipografía: los nuestros, <lista>.
Texto en pantalla: poco, sólo lo que se lee en un segundo.
```

## 4. Chequeo visual e iteración

- Mirá el resultado en el player de Motion, avanzando a mano por la línea de
  tiempo, no sólo en cuadros sueltos.
- Devoluciones cortas, de a una o dos por vuelta ("la toma 3 salta, que se
  transforme desde la tarjeta"; "más rápido entre 2 y 4").
- Cuando esté, exportá a MP4 desde Motion y subilo donde lo pida la entrega
  (`docs/entrega.md`).

## Reglas

- **Se muestra el flujo real** de la demo: las pantallas que existen. Nada de
  formatos inventados (nodos, tarjetas, paneles o montos que la app no tiene).
- Del video de referencia se toman **sólo el ritmo y las transiciones**:
  nunca sus textos, su marca, sus imágenes ni sus colores.
- Sin loop: en muchas plataformas el video queda en el último cuadro, así que
  el cierre con el logo es lo que se ve después.
