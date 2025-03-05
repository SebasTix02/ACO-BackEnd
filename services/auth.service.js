const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { generarJWT } = require('../helpers/jwt');

class AuthService {
  async login(usuario, clave) {
    // Buscar usuario
    console.log(usuario, clave);
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    if (users.length === 0) {
      throw new Error('Credenciales inválidas');
    }

    const user = users[0];

    // Verificar clave
    const claveValida = await bcrypt.compare(clave, user.clave);

    if (!claveValida) {
      throw new Error('Credenciales inválidas');
    }

    // Extraer datos relevantes para el payload
    const userPayload = {
      id: user.id,
      usuario: user.usuario,
      nombre: user.nombre,
      privilegios: user.privilegios
    };

    // Generar JWT
    const token = generarJWT(userPayload);

    return {
      token,
      usuario: userPayload // Devolvemos los datos del usuario
    };
  }
}

module.exports = new AuthService();