const jwt = require('jsonwebtoken');

const validarCookie = (req, res, next) => {
  // Obtener token SOLO de las cookies
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Cookie de autenticación no encontrada'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.usuario = {
      id: decoded.id,
      usuario: decoded.usuario,
      nombre: decoded.nombre,
      privilegios: decoded.privilegios
    };

    // Eliminar lógica de renovación automática (opcional)
    next();
  } catch (error) {
    res.clearCookie('token', {
      httpOnly: false,
      secure: true,
      sameSite: 'Lax'
    });
    return res.status(401).json({
      ok: false,
      mensaje: 'Cookie inválida o expirada'
    });
  }
};
module.exports = validarCookie;