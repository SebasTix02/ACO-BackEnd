const pool = require('../config/db');

class UbicacionTemporalService {
  async listarUbicaciones() {
    const [rows] = await pool.query(`
      SELECT u.*, c.nom_cliente AS nom_cliente 
      FROM ubicaciones_temporales u
      INNER JOIN clientes c ON u.cod_cliente = c.cod_cliente
    `);
    return rows;
  }

  async obtenerUbicacionPorId(id) {
    const [rows] = await pool.query('SELECT * FROM ubicaciones_temporales WHERE id_ubicacion = ?', [id]);
    return rows[0];
  }

  async crearUbicacion(ubicacionData) {
    const [result] = await pool.query(
      'INSERT INTO ubicaciones_temporales (cod_cliente, latitud, longitud, nombre_contacto, direccion) VALUES (?, ?, ?, ?, ?)',
      [ubicacionData.cod_cliente, ubicacionData.latitud, ubicacionData.longitud, ubicacionData.nombre_contacto, ubicacionData.direccion]
    );
    return this.obtenerUbicacionPorId(result.insertId);
  }

  async actualizarUbicacion(id, ubicacionData) {
    const campos = [];
    const valores = [];
    
    Object.entries(ubicacionData).forEach(([key, value]) => {
      campos.push(`${key} = ?`);
      valores.push(value);
    });

    const query = `UPDATE ubicaciones_temporales SET ${campos.join(', ')} WHERE id_ubicacion = ?`;
    valores.push(id);

    await pool.query(query, valores);
    return this.obtenerUbicacionPorId(id);
  }

  async eliminarUbicacion(id) {
    const [result] = await pool.query('DELETE FROM ubicaciones_temporales WHERE id_ubicacion = ?', [id]);
    if (result.affectedRows === 0) {
      return false;
    }
    return true;
  }

  async obtenerPorCliente(codCliente) {
    const [rows] = await pool.query('SELECT * FROM ubicaciones_temporales WHERE cod_cliente = ?', [codCliente]);
    return rows;
  }
}

module.exports = new UbicacionTemporalService();