const mongoose = require('mongoose');

// Modelo de los Productos "Items" del pedido
const pedidoItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  }
   // Sin id porque ya van dentro del Pedido
}, { _id: false });

// Pedidos con los productos
const pedidoSchema = new mongoose.Schema({

  items: [pedidoItemSchema],

  cliente: {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    direccion: {
      type: String,
      required: true,
      trim: true
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pedido', pedidoSchema);