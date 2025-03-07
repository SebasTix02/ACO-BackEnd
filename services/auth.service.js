const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { generarJWT } = require('../helpers/jwt');

class AuthService {
  async login(usuario, clave) {
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    if (users.length === 0) {
      throw new Error('Credenciales inválidas');
    }

    const user = users[0];

    const claveValida = await bcrypt.compare(clave, user.clave);
    if (!claveValida) {
      throw new Error('Credenciales inválidas');
    }

    // Añadir expiración al payload
    const userPayload = {
      id: user.id,
      usuario: user.usuario,
      nombre: user.nombre,
      privilegios: user.privilegios,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 días
    };

    const token = generarJWT(userPayload);

    return {
      token,
      usuario: userPayload
    };
  }
}

module.exports = new AuthService();