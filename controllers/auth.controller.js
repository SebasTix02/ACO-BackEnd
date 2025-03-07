const authService = require('../services/auth.service');

exports.login = async (req, res, next) => {
  try {
    const { usuario, clave } = req.body;
    
    // Obtener usuario y token
    const { token, usuario: userData } = await authService.login(usuario, clave);
    
    // Configurar cookie HTTPOnly
    res.cookie('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'None',
      maxAge: 86400000
    });

    // Eliminar el token de la respuesta JSON
    res.json({
      ok: true,
      usuario: {
        usuario: userData.usuario,
        privilegios: userData.privilegios
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  });
  
  res.json({
    ok: true,
    mensaje: 'Sesión cerrada exitosamente'
  });
};

exports.checkSession = async (req, res) => {
  try {
      // El middleware validarJWT ya inyectó los datos del usuario en req.usuario
      res.json({
          ok: true,
          isAuthenticated: true,
          user: {
              id: req.usuario.id,
              usuario: req.usuario.usuario,
              nombre: req.usuario.nombre,
              privilegios: req.usuario.privilegios
          }
      });
  } catch (error) {
      res.status(500).json({
          ok: false,
          mensaje: 'Error al verificar la sesión'
      });
  }
};