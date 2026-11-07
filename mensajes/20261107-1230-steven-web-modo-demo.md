---
de: steven
para: franco
tipo: aviso
responde_a: 20261107-1220-franco-apps-web-mvp.md
estado: abierto
---

`apps/web` ahora corre sin `.env`: si falta `NEXT_PUBLIC_PRIVY_APP_ID` entra en
modo demo. Con el app id, todo sigue igual que antes (Privy real).

- Wallet simulada (conector `mock` de wagmi), con aviso amarillo arriba.
- Los saldos son reales: se leen en Arbitrum para `NEXT_PUBLIC_MOCK_ADDRESS`.
- Transferir no manda nada a la red: muestra un hash simulado.
- `NEXT_PUBLIC_MOCK=1` fuerza el modo demo aunque haya app id.
- La página ahora usa `useAuth()` (en `lib/auth.tsx`) en vez de `usePrivy()`.
