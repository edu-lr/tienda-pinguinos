const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');

// Catálogo: lista todos los productos, los agotados se marcan
router.get('/', async (req, res) => {
  try {       // Se busca los productos por id y se renderiza /tienda/index
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.render('tienda/index', { productos });
    // Si hay error, salta el error
  } catch (err) {
    console.error('Error cargando catálogo:', err);
    res.render('tienda/index', { productos: [], error: 'Error cargando productos' });
  }
});

// Detalle del producto con su formulario de pedido
router.get('/producto/:id', async (req, res) => {
  try {             // Se obtiene el producto por id
    const producto = await Producto.findById(req.params.id);

    // Si no hay producto, se manda a la tienda de vuelta
    if (!producto) return res.redirect('/tienda');

    // Si hay producto se renderiza
    res.render('tienda/producto', { producto, error: null, datos: {} });

  } catch (err) {
    res.redirect('/tienda');
  }
});

// Crear pedido: un producto con cantidad + datos del iglú
router.post('/pedidos', async (req, res) => {
  const { productoId, cantidad, nombre, direccion } = req.body;

  try {                   // Se busca el producto por id
    const producto = await Producto.findById(productoId);
    // Si no hay se redirige a la tienda
    if (!producto) return res.redirect('/tienda');

    // Si no hay numero o no es valido, error
    const cant = parseInt(cantidad, 10);
    if (!Number.isInteger(cant) || cant < 1) {
      return res.render('tienda/producto', { producto, error: 'Cantidad inválida', datos: req.body });
    }
    // Si es menor al Stock
    if (cant > producto.stock) {
      return res.render('tienda/producto', { producto, error: `Solo quedan ${producto.stock} unidades`, datos: req.body });
    }
    // Se crea el pedido con los datos del req
    const pedido = await Pedido.create({
      items: [{ producto: producto._id, cantidad: cant, precioUnitario: producto.precio }],
      cliente: { nombre, direccion },
      total: producto.precio * cant
    });
    // Se resta la cantidad de stock del producto directo desde la DB
    await Producto.findByIdAndUpdate(producto._id, { $inc: { stock: -cant } });

    // Se redirige a la pagina de confirmacion de pedido
    res.redirect(`/tienda/pedidos/${pedido._id}`);

  } catch (err) {  // Si no hay producto se redirige a la tienda
    const producto = await Producto.findById(productoId).catch(() => null);
    if (!producto) return res.redirect('/tienda');

    // Si hay error con los datos, lanza mesaje especifico
    const mensaje = err.name === 'ValidationError' ? 'Revisa los datos del pedido' : 'Error al registrar el pedido';
    res.render('tienda/producto', { producto, error: mensaje, datos: req.body });
  }
});

// Confirmación del pedido (Post/Redirect/Get)
router.get('/pedidos/:id', async (req, res) => {
  try {    // Se busca pedido por ID, si no hay se manda a la tienda
    const pedido = await Pedido.findById(req.params.id).populate('items.producto');
    if (!pedido) return res.redirect('/tienda');

    // si hay pedido se manda a tienda/pedido
    res.render('tienda/pedido', { pedido });
    
    // error -> tienda
  } catch (err) {
    res.redirect('/tienda');
  }
});

module.exports = router;
