---
tipo: base
app: ambas
estado: en-progreso
archivos: []
actualizado: 2026-10-15
---
# Progreso

Checklist derivado de [[00-enunciado]]. Marcar con `[x]` al terminar y enlazar la nota correspondiente cuando exista.

## Preparación
- [x] Elegir tecnologías (ver [[01-arquitectura]])
- [x] Definir `AGENTS.md` y estructura de la bóveda
- [ ] Crear repo en GitHub con `/backend` y `/frontend`
- [ ] Inicializar proyectos Node.js (`package.json`) en ambas carpetas
- [ ] Conectar a MongoDB

## Panel de Administración (`/backend`)
- [ ] CRUD de productos (crear, listar, editar, eliminar)
- [ ] Visualización de pedidos
- [ ] Login solo para Paula (sesiones + cookie httpOnly + contraseña hasheada)
- [ ] Rutas del admin protegidas
- [ ] Vistas con Pug

## Tienda Online (`/frontend`)
- [ ] Mostrar productos
- [ ] Crear pedidos (dirección del iglú)
- [ ] Vistas con Pug, sin JavaScript en el navegador

## Entrega
- [ ] README.md con instrucciones para ejecutar ambos servidores
- [ ] HTML5 limpio y estructurado en cada página
- [ ] Revisión final: sin JS en el frontend, sin contraseñas en texto plano, REST bien aplicado

## Gloria opcional
- [ ] CSS cuidado (que Larry llore de felicidad)
- [ ] Imágenes de productos subidas desde el Panel de Admin y mostradas en la Tienda

## Conexiones
- se deriva de: [[00-enunciado]]
- depende de las decisiones de: [[01-arquitectura]]
- ubicado en: [[Índice]]
