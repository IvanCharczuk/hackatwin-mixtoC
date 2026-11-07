# Deploy rápido en Vercel

Objetivo: tener una URL de demo que funcione en los primeros 30 minutos,
aunque la app esté vacía, y volver a deployar cada vez que algo anda.

## Primera vez

Con la CLI (`npm i -D vercel` en el proyecto, o `npx vercel`):

```sh
npx vercel login            # una vez por compu
npx vercel                  # desde la carpeta de la app: crea el proyecto y da una URL de preview
npx vercel --prod           # la URL de producción, la que va en README y en la entrega
```

O sin CLI: en vercel.com, "Add New… > Project", importar el repo de GitHub.
Cada push a una rama da una URL de preview y cada merge a `main`, producción.

Si la app no está en la raíz del repo, elegí la carpeta (Root Directory) al
crear el proyecto.

## Variables de entorno

```sh
npx vercel env add NOMBRE_DE_LA_CLAVE production   # te pide el valor; no queda en el repo
npx vercel env pull .env.local                     # para usarlas en local (ignorado por git)
```

Nunca pongas claves en el código ni en archivos commiteados. Si hace falta
documentar qué variables existen, va un `.env.example` con los nombres y
valores vacíos.

## Modo demo seguro por defecto

Que la URL que ve el jurado no dependa de cuentas reales: datos de prueba o
respuestas grabadas por defecto, y el modo real detrás de una variable de
entorno (por ejemplo `DEMO_MODE=fixture` por defecto, `DEMO_MODE=real` para
probarlo). Si una API externa se cae a media demo, la app sigue andando.

## Si falla

- `npx vercel logs <url>` o la pestaña "Logs" del deployment.
- Build que anda en local y no en Vercel: casi siempre es la versión de Node,
  una variable de entorno que falta o un archivo que no está en git.
- Volver a la versión anterior: en el dashboard, "Promote" sobre el último
  deployment que andaba.

## Checklist mínimo de seguridad

Antes de pasar la URL al jurado:

- [ ] **JS de terceros con versión fija.** Nada de `@latest` ni `<script
      src>` sin versión; dependencias con lockfile commiteado
      (`package-lock.json`, `pnpm-lock.yaml`).
- [ ] **Ninguna clave en el código ni en el cliente.** Las claves de APIs
      (incluidas las de modelos) sólo en variables de entorno del servidor;
      el navegador nunca las ve.
- [ ] **`.env*` en `.gitignore`** (la plantilla ya lo trae; no lo borres).
- [ ] **Tope de gasto.** Si la demo llama a un modelo o a una API paga, la
      clave tiene límite de uso o de gasto, y hay un límite por visitante.
- [ ] **Deployment Protection** apagado sólo en la URL que se muestra; el
      resto, protegido.
