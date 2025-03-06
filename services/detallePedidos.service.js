const pool = require('../config/db');

class DetallePedidoService {
  async listarPorPedido(idPedido) {
    const [rows] = await pool.query(`
      SELECT d.*, a.nombre_art AS nombre_articulo 
      FROM detalle_pedidos d
      JOIN articulos a ON d.cod_art = a.cod_art
      WHERE d.id_pedido = ?
    `, [idPedido]);
    return rows;
  }

  async obtenerDetallePorId(id) {
    const [rows] = await pool.query('SELECT * FROM detalle_pedidos WHERE id_detalle = ?', [id]);
    return rows[0];
  }

  async crearDetalle(detalleData) {
    const [result] = await pool.query(
      'INSERT INTO detalle_pedidos (id_pedido, cod_art, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [detalleData.id_pedido, detalleData.cod_art, detalleData.cantidad, detalleData.precio_unitario]
    );
    return this.obtenerDetallePorId(result.insertId);
  }

  async actualizarDetalle(id, detalleData) {
    const camposPermitidos = ['cantidad', 'precio_unitario'];
    const campos = [];
    const valores = [];

    Object.entries(detalleData).forEach(([key, value]) => {
      if (camposPermitidos.includes(key)) {
        campos.push(`${key} = ?`);
        valores.push(value);
      }
    });

    if (campos.length === 0) throw new Error('No hay campos válidos para actualizar');
    
    const query = `UPDATE detalle_pedidos SET ${campos.join(', ')} WHERE id_detalle = ?`;
    valores.push(id);

    await pool.query(query, valores);
    return this.obtenerDetallePorId(id);
  }

  async eliminarDetalle(id) {
    const [result] = await pool.query('DELETE FROM detalle_pedidos WHERE id_detalle = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new DetallePedidoService();