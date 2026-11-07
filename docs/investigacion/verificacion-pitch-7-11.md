# Verificación de datos del pitch

Revisión de Bri (ALIS), 7/11/2026 19:25 (Buenos Aires). Alcance: los datos
que aparecen en `docs/pitch/guion.md` y en los mensajes abiertos del pitch.
Lo que no figura en la tabla como "confirmado" no quedó verificado hoy: no
decirlo en el escenario sin revisarlo antes.

## Confirmados

| Dato | Lo que dice el pitch | Lo que encontré | Fuente |
|---|---|---|---|
| Decreto que habilita crédito en dólares a empresas que no exportan | Bancos pueden prestar en USD a empresas sin exportaciones (Steven, mensaje 16:03) | DNU 736/2026, publicado el 14/8/2026. Habilita a entidades financieras a dar financiación en dólares a personas jurídicas sin ingresos por comercio exterior, bajo las condiciones que fije el BCRA | [Nino Legal, DNU 736/2026](https://ninolegal.com/novedad/decreto-736-2026-creditos-dolares-empresas-no-exportadoras) |
| Tope de depósitos en USD para ese crédito | (no está en el pitch; útil si preguntan) | El BCRA lo reglamentó: hasta 15% de los depósitos en moneda extranjera de cada entidad. Fuente secundaria, la norma del BCRA no la leí | [Instagram, cuenta de noticias citando la reglamentación](https://www.instagram.com/p/DcQz5NKjv-r/); [Canal 26](https://www.facebook.com/canal26/posts/las-entidades-financieras-podr%C3%A1n-aplicar-hasta-el-15-de-los-dep%C3%B3sitos-de-los-cli/1504219648406928/) |

## Confirmados con corrección

| Dato | Lo que dice el repo | Lo que encontré | Fuente |
|---|---|---|---|
| RIGI aprobado | Guion: «13 mineras, US$ 25.230 M» y, en otra parte, «24 proyectos por US$ 56.198 M (octubre 2026)». Steven (16:12): «27 proyectos, US$ 76.173 M al 4/11» | Dato oficial del Ministerio de Economía citado por Chequeado (2/10/2026): **23 aprobados por US$ 49.700 M**; 24 en evaluación por US$ 159.000 M. De los aprobados, **12 son mineros** (no 13). Ninguno de los números del repo coincide con este | [Chequeado](https://chequeado.com/el-explicador/el-gobierno-anuncio-en-paris-2-nuevos-rigi-cuantos-proyectos-se-aprobaron-y-cuantos-dolares-ingresaron-hasta-ahora/). El sitio oficial (argentina.gob.ar/economia/rigi) carga los totales por JavaScript y no los pude leer |

**Recomendación:** usar «23 proyectos aprobados por US$ 49.700 millones
(Ministerio de Economía, octubre 2026)» y citar esa fuente. Eliminar el "56
billions" y el "160+" del video: el número de 160 no sale de ninguna fuente que
haya visto (49.700 aprobados + 159.000 en evaluación es otra cosa). Si
alguien quiere el dato de 76.173 M del 4/11, hace falta el link del monitor
IIEP.

## Sin verificar (no decir en el escenario hasta confirmarlo)

| Dato | Dónde aparece | Qué falta |
|---|---|---|
| "Préstamos de la casa matriz quedan atados 6 meses; préstamos, 120 días (régimen BCRA de abril de 2026)" | Franco/Steven, mensaje 16:12 | No encontré la norma con esos plazos. Es el dato más fuerte del "dolor" del pitch: sin fuente, no va |
| Liquidez del mercado de Morpho donde se pide ARGt | Hay tres números: US$ 94 (16:12), 155.438 ARGt (`negocio.md`) y unos 141.000 ARGt (guion) | Revisar on-chain (Morpho / Arbiscan) y dejar un solo número con fecha |
| Vault de ARGt ~US$ 9,7 M | guion, `negocio.md` | Es el dato de Twin (`twin-stack.md`: 9,7 M USDT en el vault). Confirmar que está en el vault y no en el total |
| Liquidación de Morpho al 77% y tope de 60% | guion, preguntas del jurado | Mirar los parámetros del mercado (LLTV) en Morpho antes de citarlos |
| Tasa «en el orden de 25% anual en pesos» | guion, preguntas del jurado | Sin fuente. Decir «se ve antes de firmar», sin número |
| Xepelin: 2% de apertura y «no presta en Argentina» | Franco/Steven 16:12 | Encontré el perfil de Xepelin en Chile y México, pero no el 2% ni la ausencia en Argentina |
| Meta Project (agosto 2026, 350 empleados, San Juan) y Reliper (27/10/2026) | Steven 16:03 | Hay links en el mensaje; no los abrí todos. Abrir antes de nombrarlos en vivo |
| "Bancos sólo le prestan a empresas con gran reputación" | Steven 16:03 | Cita de una nota (La Nación / Infobae). Verificar el texto exacto antes de citarlo entre comillas |
| 1.158 empresas chilenas exportaron a Argentina en 2024 | `negocio.md` | Fuente Forbes del repo; no reverificada |
| Bitso Business +81%, Bridge US$ 1.100 M, BVNK US$ 2.000 M | `numeros.md` | Fuentes del repo; no reverificadas |
| 7.500 pymes proveedoras en Vaca Muerta | guion, mensaje 15:34 | Fuente del mensaje de Franco; no reverificada |
| Factura de crédito electrónica: umbral $ 5.549.862 | `regulacion-y-competencia.md` | Fuente ARCA del repo; no reverificada |
| Oferta de ARGt en DIA "16.200 M de tokens" | `numeros.md` | Ya marcado «a verificar» en el repo: la unidad parece un error |

## Pendiente de mi parte

- Abrir los links de Meta Project y Reliper.
- Revisar en Morpho el mercado de ARGt y el LLTV (requiere acceso al
  explorador; sin eso no hay número confiable).
- Buscar la norma del BCRA de abril 2026 con el plazo de 6 y 120 días.

Esta revisión no cambia `docs/pitch/guion.md`: lo edita su dueño, a partir de
los mensajes.
