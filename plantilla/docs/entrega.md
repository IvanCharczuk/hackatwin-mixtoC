# Entrega

Lo que suelen pedir y a qué hora tiene que estar cada cosa. Al llegar,
completá la hora real del cierre y de cada corte.

## Lo que suelen pedir

Leé las reglas del evento apenas llegues y tachá lo que no pidan.

- [ ] **Repo** público o con acceso para el jurado, con la rama `main` al día.
- [ ] **README** con qué hace, para quién, cómo correrlo y qué se usó del
      sponsor o del track (con links al código, si lo piden).
- [ ] **Video** de la demo (ver `docs/video.md`), con el link público
      probado desde otra compu.
- [ ] **Link** deployado que funcione (ver `docs/deploy.md`).
- [ ] **Slides** del pitch (ver `PITCH.md` y la sección de abajo).
- [ ] **Formulario de entrega** del evento (Devpost u otro): nombre, una
      línea, descripción, track, links.
- [ ] **Nombres del equipo** y sus cuentas, como los pida el formulario.
- [ ] Lo específico del evento (portada de cierto tamaño, archivo de
      metadatos, etc.).

No se inventa ningún link: si el video o la URL todavía no existen, el README
dice "falta" bien visible hasta que existan, y cada link se prueba desde otra
compu (o en una ventana privada) antes de entregar.

## Horarios de corte

Cierre de la entrega: **<hora>**.

| corte | hora | tiene que estar listo |
|---|---|---|
| T-3h | <hora> | Congelar features: lo que no anda, se saca. Sólo arreglos. |
| T-2h | <hora> | Deploy final en `--prod` y README completo. |
| T-1h | <hora> | Video exportado y subido; slides armadas. |
| T-30m | <hora> | Ensayo del pitch con la demo real y el video de plan B. |
| T-0 | <hora> | Entrega enviada. No esperar al último minuto: los formularios se caen. |

## Slides con el tipo Slides de claude.ai

El deck se arma con el tipo de artifact **Slides** de claude.ai: pedile a
Claude un deck de Slides y pasale el contenido de `PITCH.md` (ya completo) y
la URL de la demo. Se ve en el navegador para presentar y se baja como .pptx
o PDF si la entrega lo pide.
