const validarPrivilegios = (privilegioRequerido) => {
    return (req, res, next) => {
      const privilegiosUsuario = req.usuario?.privilegios;
  
      if (!privilegiosUsuario) {
        return res.status(403).json({
          ok: false,
          mensaje: 'Privilegios no definidos'
        });
      }
  
      const jerarquiaPrivilegios = {
        basico: 1,
        admin: 2
      };
  
      const nivelUsuario = jerarquiaPrivilegios[privilegiosUsuario];
      const nivelRequerido = jerarquiaPrivilegios[privilegioRequerido];
  
      if (nivelUsuario < nivelRequerido) {
        return res.status(403).json({
          ok: false,
          mensaje: 'Acceso no autorizado. Privilegios insuficientes'
        });
      }
  
      next();
    };
  };
  
  module.exports = validarPrivilegios;