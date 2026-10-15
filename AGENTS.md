# Tienda de los Pingüinos — Reglas para el agente

Challenge de aprendizaje. Dos apps Node.js + Express + MongoDB + Pug.
- `/backend` = Panel de Admin (Paula)
- `/frontend` = Tienda online
- `/docs` = bóveda de Obsidian (memoria del proyecto, organizada como grafo)

## Al iniciar cada sesión
1. Lee `docs/Índice.md` (mapa de toda la bóveda).
2. Lee `docs/04-progreso.md` (estado actual) y `docs/01-arquitectura.md`.
3. Sigue los `[[enlaces]]` solo hacia las notas que la tarea necesita.
   No leas toda la bóveda de una vez.

## Reglas del proyecto
- Nada de JavaScript en el frontend ni AJAX. Solo Pug renderizado en servidor.
- Contraseñas siempre hasheadas; sesiones con cookie httpOnly.
- Sigue REST. No cambies el stack sin preguntarme.
- Si algo no está en `docs/00-enunciado.md`, no lo asumas: pregúntame.

## Modo aprendiz
- Antes de escribir código, explica brevemente qué vas a hacer y por qué.
- Avanza de a un paso pequeño y espera mi confirmación.

## La bóveda es un grafo que crece con el código
Cada pieza del proyecto es una nota, y las notas se conectan entre sí.
Quiero ver en el grafo de Obsidian cómo se relacionan modelos, rutas, vistas y decisiones.

### Carpetas y tipos de nota
| Carpeta | Tipo | Una nota por... |
|---|---|---|
| `docs/modelos/` | modelo | cada modelo de Mongoose |
| `docs/rutas/` | rutas | cada grupo de rutas (ej. `rutas-productos-admin`), no cada ruta |
| `docs/vistas/` | vista | cada plantilla o grupo de plantillas Pug |
| `docs/middleware/` | middleware | cada middleware (ej. `requiere-login`) |
| `docs/decisiones/` | decision | cada decisión técnica importante |
| `docs/conceptos/` | concepto | cada concepto que aprendí (sesiones, REST, hashing...) |
| `docs/bugs/` | bug | cada bug que costó resolver y qué enseñó |

Las notas base (`00-enunciado`, `01-arquitectura`, `04-progreso`, `Índice`) quedan en la raíz de `docs/`.

### Formato de cada nota
Nombre de archivo = nombre de la nota, en minúsculas y con guiones: `modelo-producto.md`.

```markdown
---
tipo: modelo | rutas | vista | middleware | decision | concepto | bug
app: backend | frontend | ambas
estado: pendiente | en-progreso | hecho
archivos: [backend/models/Producto.js]
actualizado: 2026-10-15
---
# Producto

Qué es y para qué sirve (2-5 líneas, sin copiar el código).

## Conexiones
- usa: [[concepto-mongoose-schemas]]
- lo usan: [[rutas-productos-admin]], [[rutas-tienda]]
- relacionado con: [[modelo-pedido]]
- decidido en: [[decision-imagenes-en-disco]]
```

### Reglas de conexión
1. **Ninguna nota queda huérfana.** Toda nota nueva debe tener al menos 2 enlaces en `## Conexiones`, y debe estar enlazada desde el `Índice` o desde otra nota.
2. **Conexiones tipadas.** Usa siempre un verbo antes del enlace: `usa`, `lo usan`, `depende de`, `relacionado con`, `decidido en`, `explicado en`. Así la relación tiene significado.
3. **Enlaces en los dos sentidos.** Si A enlaza a B, abre B y agrega el enlace de vuelta hacia A.
4. **Nombres exactos.** Un `[[enlace]]` debe coincidir con el nombre de un archivo existente. Antes de enlazar, verifica que la nota existe; si no, créala o márcala como pendiente.
5. **Una idea por nota.** Si una nota crece demasiado, divídela y enlaza las partes.
6. **No dupliques.** Antes de crear una nota, busca si ya existe una parecida y edítala en su lugar.

### Cuándo crear o actualizar notas
Después de cada cambio relevante en el código, y **antes de dar la tarea por terminada**:
- Modelo nuevo o cambiado → nota en `modelos/` + actualizar los modelos y rutas relacionados.
- Rutas nuevas o cambiadas → nota en `rutas/` + enlazar al modelo, middleware y vistas que usan.
- Vista nueva → nota en `vistas/` enlazada a la ruta que la renderiza.
- Decisión técnica → nota en `decisiones/` (qué se decidió, alternativas, por qué) y enlazarla desde las notas afectadas.
- Concepto nuevo que expliqué → nota en `conceptos/`, con un ejemplo corto del proyecto.
- Bug difícil resuelto → nota en `bugs/` (síntoma, causa, solución) enlazada al concepto o pieza que lo causó.
- Siempre: actualizar `estado` y `actualizado` de las notas tocadas, marcar el avance en `04-progreso.md` y agregar toda nota nueva al `Índice`.

No crees notas para cambios triviales (renombrar una variable, ajustar un color).

### Cierre de cada tarea
Termina con un resumen corto: qué código cambiaste, qué notas creaste o editaste y qué conexiones nuevas agregaste. Así puedo revisarlo con `git diff`.

## Límites
- Este archivo solo contiene reglas. Los detalles del proyecto van en `docs/`, nunca aquí.
- No borres notas ni enlaces sin preguntarme.
- Si dudas entre crear una nota o no, pregúntame.
