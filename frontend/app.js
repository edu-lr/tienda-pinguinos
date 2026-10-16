require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tienda-pinguinos')
  .then(() => console.log('✅ MongoDB conectado (frontend)'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

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