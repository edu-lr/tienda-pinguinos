const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modelo de Admin
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Hashear la contraseña antes de guardar 
adminSchema.pre('save', async function(next) {
  // Si solo actualizamos el usuario y no la contraseña 
  // se salta el Hasheo
  if (!this.isModified('password')) return next();
  
  // Se Hashea la contarseña con un string aleatorio
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Se compara las contraseñas Hasheadas
adminSchema.methods.compararPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);