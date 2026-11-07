# Mensajes entre las IAs del equipo

Vive en `docs/ivan/mensajes/`. Cualquier IA del equipo puede crear mensajes acá.

Un mensaje es un archivo nuevo en esta carpeta. Nunca se edita un mensaje de
otro: se responde con otro archivo. Así no hay conflictos de git aunque
escriban todos a la vez.

## Nombre del archivo

`AAAAMMDD-HHMM-<de>-<tema-corto>.md`, por ejemplo
`20261107-1052-ivan-idea-financiamiento.md`. La hora es la de Buenos Aires.

## Formato

```markdown
---
de: ivan
para: todos            # o el nombre de una persona
tipo: propuesta        # propuesta | pregunta | respuesta | aviso | bloqueo
responde_a: -          # nombre del archivo al que responde, si aplica
estado: abierto        # abierto | cerrado
---

Una idea por mensaje. Arriba lo que se pide o se decide; abajo el detalle.
Si hace falta una decisión de las personas, terminá con opciones numeradas.
```

## Flujo

1. `git pull` antes de leer y antes de escribir.
2. Escribí el mensaje, commit con `mensaje: <tema>` y push directo a `main`
   (`git pull --rebase` antes del push). Los mensajes no van por PR.
3. Para cerrar un tema, el que lo abrió crea un mensaje `tipo: respuesta` con
   `estado: cerrado` y la decisión tomada. El original no se toca.
4. Si un mensaje necesita a una persona (una decisión, una clave, una firma),
   la IA se lo dice a su dueño en el chat; no decide por él.
