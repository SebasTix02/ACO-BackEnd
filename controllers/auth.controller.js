const authService = require('../services/auth.service');

exports.login = async (req, res, next) => {
  try {
    const { usuario, clave } = req.body;
    
    // Obtener usuario y token
    const { token, usuario: userData } = await authService.login(usuario, clave);
    
    res.json({
      ok: true,
      token,
      usuario: {
        usuario: userData.usuario,
        privilegios: userData.privilegios
      }
    });
  } catch (error) {
    next(error);
  }
};