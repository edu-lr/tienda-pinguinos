const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const requiereLogin = require('../middleware/requiere-login');

// Login GET muestra el formulario, si ya iniciaste sesion pasa a productos directamente
router.get('/login', (req, res) => {
  if (req.session.adminId) {
    return res.redirect('/admin/productos');
  }
  res.render('admin/login', { error: null });
});

// Login POST se manda el formulario y si es correcto se crea la session y pasa a productos
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {                 // se busca admin por id
    const admin = await Admin.findOne({ username });
    // si no hay, error 
    if (!admin) {
      return res.render('admin/login', { error: 'Usuario o contraseña incorrectos' });
    }
    // se compara la contraseña del Post
    const match = await admin.compararPassword(password);
    // si no es, error
    if (!match) {
      return res.render('admin/login', { error: 'Usuario o contraseña incorrectos' });
    }
    // se le agrega el id de session a la respuesta
    req.session.adminId = admin._id;
    res.redirect('/admin/productos');

  } catch (err) {
    console.error('Error en login:', err);
    res.render('admin/login', { error: 'Error del servidor' });
  }
});

// Logout se cierra y elimina la session
router.get('/logout', (req, res) => {
  // se destruye la session
  req.session.destroy(err => {
    if (err) console.error('Error al cerrar sesión:', err);
    res.redirect('/admin/login');
  });
});


// Proteger todas las rutas de abajo (solo para admins)
router.use(requiereLogin);

// Listar productos
router.get('/productos', async (req, res) => {
  try {     // Busca todo los productos en la DB y los ordena de manera decendente a su fecha de creacion
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.render('admin/productos/index', { productos });
    // Si hay error, se muestra
  } catch (err) {
    console.error('Error listando productos:', err);
    res.render('admin/productos/index', { productos: [], error: 'Error cargando productos' });
  }
});

// Formulario nuevo producto
router.get('/productos/nuevo', (req, res) => {
  // redireccionar a la ruta de crear nuevo producto
  res.render('admin/productos/nuevo', { error: null, datos: {} });
});

// Crear producto
router.post('/productos', async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen } = req.body;

  try {
    await Producto.create({ nombre, descripcion, precio, stock, imagen });
    // Si se creo correctamente, se manda a /productos/
    res.redirect('/admin/productos');

    // Si hay error se devuelve a la pagina
  } catch (err) {
    console.error('Error creando producto:', err);
    res.render('admin/productos/nuevo', {
      error: 'Error creando producto',
      datos: req.body
    });
  }
});

// Formulario editar producto
router.get('/productos/:id/editar', async (req, res) => {
  try {                // se busca el producto por su id
    const producto = await Producto.findById(req.params.id);

    // si no hay producto, error
    if (!producto) return res.redirect('/admin/productos');
    res.render('admin/productos/editar', { producto, error: null });

    // Si hay error, vuelve a /productos/
  } catch (err) {
    console.error('Error cargando producto:', err);
    res.redirect('/admin/productos');
  }
});

// Actualizar producto
router.put('/productos/:id', async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen } = req.body;

  try {     // se busca por id y se actualiza
    await Producto.findByIdAndUpdate(req.params.id, { nombre, descripcion, precio, stock, imagen });
    res.redirect('/admin/productos');

  } catch (err) {
    console.error('Error actualizando producto:', err);
    const producto = await Producto.findById(req.params.id);
    // se vuelve a redireccionar a la pagina de editar
    res.render('admin/productos/editar', {
      error: 'Error actualizando producto',
      // Se toma el objeto con los datos ya cambiados y se remplaza por el original asi no se pierde lo ya escrito
      producto: { ...producto.toObject(), ...req.body }
    });
  }
});

// Eliminar producto
router.delete('/productos/:id', async (req, res) => {
  try {        // Se busca por id y se elimina el producto
    await Producto.findByIdAndDelete(req.params.id);
    res.redirect('/admin/productos');

  } catch (err) {
    console.error('Error eliminando producto:', err);
    res.redirect('/admin/productos');
  }
});

// Ver pedidos
router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('items.producto')
      .sort({ createdAt: -1 });
    res.render('admin/pedidos/index', { pedidos });
    
  } catch (err) {
    console.error('Error cargando pedidos:', err);
    res.render('admin/pedidos/index', { pedidos: [], error: 'Error cargando pedidos' });
  }
});

module.exports = router;