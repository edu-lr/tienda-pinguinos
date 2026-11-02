# Tienda de los Pingüinos

Tienda online y panel de administración para que los pingüinos compren desde su iglú y Paula gestione el inventario. Son dos aplicaciones Node.js + Express que comparten la misma base de datos MongoDB. Todo el HTML se genera en el servidor con Pug: no hay JavaScript en el navegador.

## Cómo funciona

- **Panel de administración (`backend/`)**: Paula inicia sesión, crea/edita/elimina productos y revisa los pedidos. Las rutas están protegidas por sesión.
- **Tienda (`frontend/`)**: muestra el catálogo, el detalle de cada producto y permite hacer un pedido con nombre y dirección del iglú. Al confirmar, el pedido se guarda y el stock se descuenta.
- **MongoDB**: las dos apps se conectan a la misma base y a las mismas colecciones (`productos`, `pedidos`, `admins`).
- **Seguridad**: la contraseña de Paula se guarda hasheada con bcrypt; la sesión usa una cookie `httpOnly` y se almacena en MongoDB.
- **Sin JavaScript en el frontend**: los formularios usan `method-override` para simular `PUT` y `DELETE` desde HTML.

## Estructura

```
.
├── backend/              Panel de administración
│   ├── app.js            Servidor Express (puerto 3000)
│   ├── models/           Producto, Pedido y Admin
│   ├── routes/           Login, productos y pedidos
│   ├── middleware/       requiere-login
│   ├── views/            Plantillas Pug
│   └── public/css/       Estilos del panel
├── frontend/             Tienda online
│   ├── app.js            Servidor Express (puerto 3001)
│   ├── models/           Producto y Pedido (schemas copiados)
│   ├── routes/           Catálogo y pedidos
│   ├── views/            Plantillas Pug
│   └── public/css/       Estilos de la tienda
└── docs/                 Bóveda de Obsidian (local, no se versiona)
```

## Requisitos

- Node.js LTS (18 o superior)
- Una base de datos MongoDB: MongoDB Atlas o una instancia local
- Dos terminales para ejecutar ambos servidores

## Puesta en marcha

### 1. Instalar dependencias

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Crear los archivos `.env`

En `backend/.env`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tienda-pinguinos
SESSION_SECRET=una-frase-larga-y-secreta
SESSION_MAX_AGE=86400000
PORT=3000
```

En `frontend/.env`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tienda-pinguinos
PORT=3001
```

Las dos deben apuntar a la **misma** `MONGODB_URI`. Si usás MongoDB local, podés omitirla y se usará `mongodb://localhost:27017/tienda-pinguinos`.

### 3. Crear el usuario de Paula

El proyecto no incluye credenciales por defecto. Creá un archivo temporal `backend/crear-admin.js` con este contenido:

```js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tienda-pinguinos')
  .then(async () => {
    await Admin.create({ username: 'paula', password: 'cambia-esta-clave' });
    console.log('Admin creado');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
```

Ejecutalo desde `backend/` con `node crear-admin.js`, cambiá la contraseña por una segura y borrá el archivo después. El hook del modelo la hashea automáticamente.

### 4. Arrancar los servidores

En una terminal:

```bash
cd backend
npm run dev
```

En otra terminal:

```bash
cd frontend
npm run dev
```

- Panel de administración: <http://localhost:3000/admin/login>
- Tienda: <http://localhost:3001>

## Flujo de prueba

1. Entrá al panel con el usuario que creaste.
2. Creá un producto con nombre, descripción, precio y stock.
3. Abrí la tienda, elegí el producto y hacé un pedido.
4. Volvé al panel: el pedido aparece en **Pedidos** y el stock del producto bajó.

## Rutas principales

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/admin/login` | Muestra el formulario de login |
| POST | `/admin/login` | Valida credenciales y crea la sesión |
| GET | `/admin/logout` | Destruye la sesión |
| GET | `/admin/productos` | Lista los productos |
| GET | `/admin/productos/nuevo` | Formulario de alta |
| POST | `/admin/productos` | Crea un producto |
| GET | `/admin/productos/:id/editar` | Formulario de edición |
| PUT | `/admin/productos/:id` | Actualiza (vía `?_method=PUT`) |
| DELETE | `/admin/productos/:id` | Elimina (vía `?_method=DELETE`) |
| GET | `/admin/pedidos` | Lista los pedidos |
| GET | `/tienda` | Catálogo |
| GET | `/tienda/producto/:id` | Detalle y formulario de pedido |
| POST | `/tienda/pedidos` | Crea el pedido y descuenta stock |
| GET | `/tienda/pedidos/:id` | Confirmación del pedido |

## Problemas comunes

- **`querySrv ECONNREFUSED` al conectar a Atlas**: el código fuerza DNS públicos (`1.1.1.1` y `8.8.8.8`) al arrancar. Verificá tu conexión a internet o cambiá esos DNS en `app.js`.
- **`MongooseServerSelectionError`**: revisá que la URI sea correcta y que tu IP esté habilitada en MongoDB Atlas (Network Access).
- **No puedo entrar al panel**: verificá que hayas creado el usuario y que estés usando la misma base de datos en las dos apps.
- **El catálogo está vacío**: creá productos desde el panel; la tienda muestra lo que haya en la base.
- **Puerto ocupado**: cambiá `PORT` en el `.env` correspondiente.
