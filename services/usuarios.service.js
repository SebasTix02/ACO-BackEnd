const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class UsuarioService {
  async listarUsuarios() {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
  }

  async obtenerUsuarioPorId(id) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  async crearUsuario(usuario) {
    // Encriptar clave
    const salt = await bcrypt.genSalt(10);
    const claveEncriptada = await bcrypt.hash(usuario.clave, salt);

    const [result] = await pool.query(
      'INSERT INTO usuarios (usuario, clave, nombre, apellido, privilegios) VALUES (?, ?, ?, ?, ?)',
      [usuario.usuario, claveEncriptada, usuario.nombre, usuario.apellido, usuario.privilegios]
    );
    
    return this.obtenerUsuarioPorId(result.insertId);
  }

  async actualizarUsuario(id, usuario) {
    let claveEncriptada;
    const updates = [];
    const values = [];

    // Construir dinámicamente la consulta
    if (usuario.nombre) {
      updates.push('nombre = ?');
      values.push(usuario.nombre);
    }
    
    if (usuario.apellido) {
      updates.push('apellido = ?');
      values.push(usuario.apellido);
    }
    
    if (usuario.privilegios) {
      updates.push('privilegios = ?');
      values.push(usuario.privilegios);
    }
    
    if (usuario.clave) {
      const salt = await bcrypt.genSalt(10);
      claveEncriptada = await bcrypt.hash(usuario.clave, salt);
      updates.push('clave = ?');
      values.push(claveEncriptada);
    }

    if (updates.length === 0) {
      throw new Error('No se proporcionaron datos para actualizar');
    }

    const query = `UPDATE usuarios 
                   SET ${updates.join(', ')} 
                   WHERE id = ?`;
    
    values.push(id);

    await pool.query(query, values);
    return this.obtenerUsuarioPorId(id);
  }

  async eliminarUsuario(id) {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return true;
  }
}

module.exports = new UsuarioService();