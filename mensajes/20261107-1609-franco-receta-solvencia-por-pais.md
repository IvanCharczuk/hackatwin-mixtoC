---
de: franco
para: ivan
tipo: propuesta
responde_a: -
estado: abierto
---

**Ivan: Franco propone armar el chequeo de antecedentes de la empresa como una
receta abstracta de solvencia, con una implementación por país.** Chile es el
caso base: es el país con mayor inversión minera entrando a Argentina (Excon en
Vicuña, el ejemplo del pitch).

Hoy el agente revisa en el BCRA a la empresa y al proveedor, pero una empresa
que recién llega no tiene historia en el BCRA. Su solvencia está en su país de
origen. La receta dice **qué** se verifica; cada país resuelve **dónde** y
**cómo**, uno por uno.

## La receta (igual para todos los países)

| Paso | Qué responde | Salida |
|---|---|---|
| 1. Identidad | ¿La empresa existe y quién la representa? | id fiscal válido, razón social, representantes |
| 2. Situación fiscal | ¿Está al día con el fisco de su país? | al día / con deuda / sin dato |
| 3. Deuda financiera | ¿Debe a bancos o tiene atrasos? | nivel de riesgo normalizado (equivalente a situación 1 a 5 del BCRA) |
| 4. Morosidad comercial | ¿Tiene protestos o deudas impagas con proveedores? | sí / no / sin dato |
| 5. Juicios y sanciones | ¿Tiene quiebras, juicios relevantes o sanciones? | sí / no / sin dato |
| 6. Onchain | ¿Su wallet tiene historia y colateral? | ya existe en el agente, sirve para todos |
| 7. Veredicto | Con lo anterior, ¿cuánto se le presta? | tope 60/50/40/0 como hoy, con la explicación |

Cada paso devuelve el mismo formato normalizado, con la fuente y la fecha de
la consulta. "Sin dato" baja el tope, nunca lo sube. El veredicto (paso 7) no
sabe de qué país viene la empresa.

## Chile, primera implementación

Fuentes candidatas, **sin verificar todavía** (qué expone cada una por API o
sólo por web, y si pide clave):

- Identidad: RUT y Registro de Empresas y Sociedades.
- Fiscal: SII (situación tributaria del RUT).
- Deuda financiera: CMF (supervisor bancario).
- Morosidad comercial: Boletín Comercial de la Cámara de Comercio de Santiago.
- Juicios: Poder Judicial (consulta de causas por RUT).

## En el código

Una interfaz por paso en `packages/agente` y un adaptador por país
(`paises/argentina` envuelve lo que ya hay del BCRA, `paises/chile` es el
nuevo). Para la demo alcanza con Chile con datos de ejemplo marcados como
tales y la receta explicada en el pitch como lo que escala a otros países
(Perú, Brasil, Canadá, Australia, de donde vienen las otras mineras).

## Para decidir

1. Ivan arma la receta en `packages/agente/SPEC.md` y el adaptador de Chile.
2. La receta va como idea en `docs/ideas/` y el código queda para después de
   la entrega.
3. Sólo se cuenta en el pitch, sin código hoy.
