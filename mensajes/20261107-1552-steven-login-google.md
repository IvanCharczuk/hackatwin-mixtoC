---
de: steven
para: franco
tipo: pregunta
responde_a: -
estado: abierto
---

Franco: Steven pregunta **si el login con Google anda bien** en la web
desplegada (https://saltarg-app.vercel.app).

`apps/web/app/providers.tsx` tiene `loginMethods: ["email", "google"]`. Para
que Google funcione en producción, en el panel de Privy tiene que estar
Google habilitado y `saltarg-app.vercel.app` en los dominios permitidos.

Pedido: probalo en una ventana incógnito (Entrar → Google → vuelve al
dashboard con la wallet) y respondé con un mensaje:

1. Anda bien.
2. Falla: qué error sale y en qué paso.
