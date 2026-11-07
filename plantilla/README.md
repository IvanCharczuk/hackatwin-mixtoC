# <nombre del proyecto>

**<Una línea: qué hace y para quién.>**

- **URL de la demo:** <completar con la URL de `vercel --prod`>
- **Video:** <completar>
- **Hackathon / track:** <completar>
- **Equipo:** <nombres>

## Qué hace

<Tres a cinco líneas. El problema, la solución y el momento "wow" de la demo.>

## Cómo correrlo

```sh
<comandos para instalar y levantarlo en local>
```

Variables de entorno: copiá `.env.example` a `.env` (si existe) y completá.
Nunca commitees `.env`.

---

## Sobre esta plantilla

Este repo sale de una plantilla para trabajar en una hackathon con agentes y
en paralelo. Al crear el proyecto:

1. `gh repo create <proyecto> --private --template <dueño>/<plantilla> --clone`
   (o el botón "Use this template").
2. Cada persona, en su clon: `scripts/init --yo <nombre> --email <correo>`.
   Pone tu correo sólo en ese clon y crea tus ramas `<nombre>/mac` y
   `<nombre>/pc`.
3. Completar este README (arriba), `REPARTO.md` y `TAREAS.md`.
4. Completar `CONCEPTO.md` entre todos (45 a 60 minutos), antes de las specs.
5. Una spec por pieza en `specs/` (copiando `specs/PLANTILLA.md`).

| Archivo | Para qué |
|---|---|
| `AGENTS.md` | Reglas para cualquier agente que trabaje acá |
| `CONCEPTO.md` | Principios, 360 y recursos con intención, antes de construir |
| `REPARTO.md` | Ramas, quién toca qué carpeta, PR |
| `TAREAS.md` | La cola de tareas del equipo |
| `specs/PLANTILLA.md` | Spec corta con criterios de aceptación |
| `PITCH.md` | Las 5 diapositivas del pitch |
| `docs/deploy.md` | URL de demo en Vercel en minutos, con checklist de seguridad |
| `docs/entrega.md` | Qué se entrega y horarios de corte |
| `docs/video.md` | Video de la demo con Claude Motion |
| `docs/referencias.md` | Referencias de diseño |
| `docs/tokens.md` | Cómo no quedarse sin tokens |
| `docs/webmcp.md` | WebMCP: que un agente use tu app sin computer use |

Cuando el proyecto arranca, esta sección se puede borrar.
