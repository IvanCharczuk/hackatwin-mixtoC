# Estado del equipo

Un archivo para todos: cada persona (y su IA) mantiene sólo su sección, con la
hora de la última actualización. Lo primero que lee cualquier IA al arrancar.

## Ivan

Actualizado: 7/11/2026 13:56.

- **Hecho:** el agente (`packages/agente`): perfil BCRA y onchain, tope sobre
  el colateral (60/50/40/0), cuánto ARGt puede pedir hoy, factura a pagar con
  perfil del proveedor, plan de pago y checks, y explicación con Claude Haiku.
  Endpoint `POST /api/agente` en `apps/web`. 22 tests en verde.
- **También:** modelo de negocio, liquidez, competencia y regulación en el
  README; stack de Twin en `docs/investigacion/twin-stack.md`.
- **Necesito de otros:** la pantalla de cargar factura en el dashboard
  (mensaje de las 13:56 con la llamada); y que los mentores de Twin confirmen
  el curador del vault de ARGt.

## Steven

Actualizado: 7/11/2026 13:29.

- **Decidido:** expansión regional con el circuito de Franco: la empresa
  chilena deja CHLt de colateral en Morpho y recibe ARGt
  ([ideas/expansion-regional.md](ideas/expansion-regional.md)).
- **Hecho:** landing C en `apps/landing` (capturas en
  `apps/landing/capturas/`); modo demo de `apps/web` (corre sin
  `NEXT_PUBLIC_PRIVY_APP_ID`, wallet simulada).
- **En qué estoy:** boceto del dashboard de la empresa (cuánto puede pedir,
  cuánto debe, qué tan seguro está) en estilo Amanecer, para `apps/web`.
- **Necesito de otros:** Franco, si `packages/circuito` ya exporta los
  chequeos, para que el dashboard los use. Nombre del producto (candidatos:
  Paso, Abra).

## Franco

Ver `apps/web/README.md` y `packages/circuito/README.md` hasta que lo pase acá.

## Bri

Actualizado: 7/11/2026 19:25. Trabaja con ALIS (IA de Bri).

- **Hecho:** sumada al equipo. Zona: modelo de negocio, competencia, números y
  pitch. Revisión de datos del pitch con fuentes en
  [investigacion/verificacion-pitch-7-11.md](investigacion/verificacion-pitch-7-11.md).
  Confirmado el DNU 736/2026 (crédito en dólares a empresas sin exportaciones).
- **Hallazgo principal:** el RIGI del repo no coincide con la fuente oficial
  (Chequeado, octubre: 23 aprobados por US$ 49.700 M, 12 mineros). Ver mensaje
  de las 19:25.
- **En qué estoy:** verificar los datos sin fuente del guion (plazo de 6 y 120
  días, liquidez de Morpho, tasa, Xepelin) y abrir los links de Meta Project y
  Reliper.
- **Necesito de otros:** Ivan, si usamos el dato de Chequeado en el guion y el
  video. Steven, el link del 27 / US$ 76.173 M. Franco, la norma de los 6 y
  120 días y acceso para mirar la liquidez de Morpho.
