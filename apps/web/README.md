# web

Front de la demo. Hoy: login con Privy (wallet embebida), chequeo de que la
wallet está en Arbitrum (y cambio de red), saldos de ETH, ARGt, CHLt y USDT0,
y transferencia ERC-20 con hash y link a Arbiscan.

- **Dueño:** Franco
- **Estado:** MVP de login + red + transferencia. Falta el circuito
  (`packages/circuito`) y el agente.
- **Correr:** `.env` con `NEXT_PUBLIC_PRIVY_APP_ID` (ver `.env.example`), después
  `npm install` en la raíz y `npm run -w apps/web dev`. En dashboard.privy.io
  el origen `http://localhost:3000` tiene que estar permitido.
