require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tienda-pinguinos')
  .then(() => console.log('✅ MongoDB conectado (backend)'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones / Cookies
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/tienda-pinguinos'
  }),
  cookie: {
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000
  }
}));

// Rutas
app.get('/', (req, res) => {
  res.redirect('/admin/productos');
});

app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🐧 Panel de Admin corriendo en http://localhost:${PORT}`);
});

module.exports = app;