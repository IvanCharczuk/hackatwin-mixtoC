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

Sin estado todavía.
