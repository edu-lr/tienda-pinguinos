require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
  res.redirect('/tienda');
});

// Importar rutas cuando existan
// app.use('/tienda', require('./routes/tienda'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🛍️ Tienda Online corriendo en http://localhost:${PORT}`);
});

module.exports = app;