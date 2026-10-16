const Admin = require('../models/Admin');

// Middleware que requiere que Paula esté logueada
async function requiereLogin(req, res, next) {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }

  try {
    const admin = await Admin.findById(req.session.adminId).select('-password');
    if (!admin) {
      req.session.destroy();
      return res.redirect('/admin/login');
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.error('Error en requiereLogin:', err);
    res.redirect('/admin/login');
  }
}

module.exports = requiereLogin;