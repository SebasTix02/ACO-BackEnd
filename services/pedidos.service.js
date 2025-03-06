const pool = require('../config/db');

class PedidoService {
  async listarPedidos() {
    const [rows] = await pool.query(`
      SELECT p.*, c.nom_cliente AS nombre_cliente, u.latitud, u.longitud 
      FROM pedidos p
      JOIN clientes c ON p.cod_cliente = c.cod_cliente
      JOIN ubicaciones_temporales u ON p.id_ubicacion = u.id_ubicacion
    `);
    return rows;
  }

  async obtenerPedidoPorId(id) {
    const [rows] = await pool.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
    return rows[0];
  }

  async crearPedido(pedidoData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Generar número de pedido único
      const numeroPedido = `PED-${Date.now()}`;
      
      const [result] = await connection.query(
        `INSERT INTO pedidos 
        (numero_pedido, cod_cliente, id_ubicacion, id_ruta, estado, total) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          numeroPedido,
          pedidoData.cod_cliente,
          pedidoData.id_ubicacion,
          null,
          pedidoData.estado || 'PENDIENTE',
          pedidoData.total
        ]
      );

      await connection.commit();
      return this.obtenerPedidoPorId(result.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async actualizarPedido(id, pedidoData) {
    const camposPermitidos = ['estado', 'id_ruta', 'total'];
    const campos = [];
    const valores = [];

    Object.entries(pedidoData).forEach(([key, value]) => {
      if (camposPermitidos.includes(key)) {
        campos.push(`${key} = ?`);
        valores.push(value);
      }
    });

    if (campos.length === 0) throw new Error('No hay campos válidos para actualizar');
    
    const query = `UPDATE pedidos SET ${campos.join(', ')} WHERE id_pedido = ?`;
    valores.push(id);

    await pool.query(query, valores);
    return this.obtenerPedidoPorId(id);
  }

  async eliminarPedido(id) {
    const [result] = await pool.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    return result.affectedRows > 0;
  }

  async obtenerPedidosPorEstado(estado) {
    const [rows] = await pool.query('SELECT * FROM pedidos WHERE estado = ?', [estado]);
    return rows;
  }
}

module.exports = new PedidoService();