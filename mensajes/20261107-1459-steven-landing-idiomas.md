---
de: steven
para: todos
tipo: aviso
responde_a: -
estado: abierto
---

La landing ya se puede ver en español, inglés y portugués: selector ES · EN · PT
arriba a la derecha. Recuerda el idioma elegido y, si no hay uno, usa el del
navegador.

Ojo para quien toque textos de la landing: ya no van en `App.tsx`, van en
`apps/landing/src/i18n.tsx`, en los tres idiomas. Si falta una clave en inglés
o portugués, el build falla.

Capturas en `apps/landing/capturas/idiomas/`. La web (`apps/web`) viene por PR
para Franco.
