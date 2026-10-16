const Admin = require('../models/Admin');

// Middleware que requiere que Paula esté logueada
async function requiereLogin(req, res, next) {
  // Si no tiene session, redirige a Login
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }

  try {                     // se busca por ID            Y  se le saca la password
    const admin = await Admin.findById(req.session.adminId).select('-password');
    // Si ese admin no esta en la base de datos, se destruye

    if (!admin) {
      req.session.destroy();
      // Y redirige a Login
      return res.redirect('/admin/login');
    }

    // Se guarda el admin en la respuesta
    req.admin = admin;
    next();

  } catch (err) {
    console.error('Error en requiereLogin:', err);
    res.redirect('/admin/login');
  }
}

module.exports = requiereLogin;