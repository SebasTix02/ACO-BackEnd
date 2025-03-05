const jwt = require('jsonwebtoken');

const generarJWT = (usuario) => {
  const payload = {
    id: usuario.id,
    usuario: usuario.usuario,
    nombre: usuario.nombre,
    privilegios: usuario.privilegios
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '8h'
  });
};

module.exports = { generarJWT };