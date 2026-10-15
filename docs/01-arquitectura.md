---
tipo: base
app: ambas
estado: en-progreso
archivos: []
actualizado: 2026-10-15
---
# Arquitectura

Dos aplicaciones independientes (dos servidores, dos puertos) que comparten **la misma base de datos MongoDB**. Todo el HTML se genera en el servidor con Pug; no hay JavaScript en el navegador.

## Estructura del repo
```
tienda-pinguinos/
├── AGENTS.md
├── backend/    ← Panel de Admin (Paula)
├── frontend/   ← Tienda online
└── docs/       ← bóveda de Obsidian
```

## Stack
- Node.js (LTS) + Express
- MongoDB + Mongoose
- Pug (renderizado en servidor)
- Autenticación (solo backend): express-session, connect-mongo, bcrypt, cookie httpOnly
- Soporte: dotenv, nodemon, method-override (simula PUT/DELETE desde formularios HTML)
- Opcional: multer (subida de imágenes)

## Responsabilidades
| App | Qué hace | Requisitos que cubre |
|---|---|---|
| `backend` | CRUD de productos, ver pedidos, login de Paula | Panel de Administración del [[00-enunciado]] |
| `frontend` | Mostrar productos, crear pedidos | Tienda Online del [[00-enunciado]] |

## Pendiente de decidir
- Puertos de cada servidor
- Si el modelo de datos se comparte (copiado en cada app) o se define una sola vez
- Dónde se guardan las imágenes de productos (si se hace la parte opcional)
- Modelos previstos aún sin nota: Producto, Pedido, Admin

Cada decisión que se tome se registra como nota en `decisiones/` y se enlaza aquí.

## Conexiones
- parte del enunciado: [[00-enunciado]]
- su avance se mide en: [[04-progreso]]
- ubicado en: [[Índice]]
