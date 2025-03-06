const pool = require('../config/db');

class PedidoService {
  async listarPedidos() {
    const [rows] = await pool.query(`
      SELECT 
        p.*, 
        c.nom_cliente AS nombre_cliente, 
        u.latitud, 
        u.longitud,
        COALESCE(
          JSON_UNQUOTE(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id_detalle', d.id_detalle,
                'cod_art', d.cod_art,
                'nombre_articulo', a.nombre_art,
                'cantidad', d.cantidad,
                'precio_unitario', d.precio_unitario,
                'subtotal', d.subtotal
              )
            )
            FROM detalle_pedidos d
            JOIN articulos a ON d.cod_art = a.cod_art
            WHERE d.id_pedido = p.id_pedido)
          ),
          '[]'
        ) AS detalles
      FROM pedidos p
      JOIN clientes c ON p.cod_cliente = c.cod_cliente
      JOIN ubicaciones_temporales u ON p.id_ubicacion = u.id_ubicacion
    `);
  
    return rows.map(row => ({
      ...row,
      detalles: this.parsearDetalles(row.detalles)
    }));
  }
  
  parsearDetalles(detalles) {
    try {
      return typeof detalles === 'string' ? JSON.parse(detalles) : detalles;
    } catch (e) {
      console.error('Error parseando detalles:', detalles);
      return [];
    }
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
      
      // Crear el pedido principal
      const [result] = await connection.query(
        `INSERT INTO pedidos 
        (numero_pedido, cod_cliente, id_ubicacion, id_ruta, estado, total) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          numeroPedido,
          pedidoData.cod_cliente,
          pedidoData.id_ubicacion,
          pedidoData.id_ruta || null,
          pedidoData.estado || 'PENDIENTE',
          pedidoData.total
        ]
      );

      const idPedido = result.insertId;

      // Crear detalles del pedido
      if (pedidoData.detalles_pedidos && pedidoData.detalles_pedidos.length > 0) {
        for (const detalle of pedidoData.detalles_pedidos) {
          await connection.query(
            `INSERT INTO detalle_pedidos 
            (id_pedido, cod_art, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?)`,
            [idPedido, detalle.cod_art, detalle.cantidad, detalle.precio_unitario]
          );
        }
        
        // Calcular y actualizar total real
        const [totalCalculado] = await connection.query(
          `SELECT SUM(cantidad * precio_unitario) AS total 
          FROM detalle_pedidos 
          WHERE id_pedido = ?`,
          [idPedido]
        );
        
        await connection.query(
          `UPDATE pedidos SET total = ? WHERE id_pedido = ?`,
          [totalCalculado[0].total, idPedido]
        );
      }

      await connection.commit();
      return this.obtenerPedidoConDetalles(idPedido);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async actualizarPedido(id, pedidoData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Actualizar campos principales
      const camposPermitidos = ['estado', 'id_ruta'];
      const campos = [];
      const valores = [];

      Object.entries(pedidoData).forEach(([key, value]) => {
        if (camposPermitidos.includes(key)) {
          campos.push(`${key} = ?`);
          valores.push(value);
        }
      });

      if (campos.length > 0) {
        const query = `UPDATE pedidos SET ${campos.join(', ')} WHERE id_pedido = ?`;
        valores.push(id);
        await connection.query(query, valores);
      }

      // Actualizar detalles si existen
      if (pedidoData.detalles_pedidos) {
        // Eliminar detalles antiguos
        await connection.query(
          `DELETE FROM detalle_pedidos WHERE id_pedido = ?`,
          [id]
        );

        // Insertar nuevos detalles
        for (const detalle of pedidoData.detalles_pedidos) {
          await connection.query(
            `INSERT INTO detalle_pedidos 
            (id_pedido, cod_art, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?)`,
            [id, detalle.cod_art, detalle.cantidad, detalle.precio_unitario]
          );
        }

        // Actualizar total
        const [totalCalculado] = await connection.query(
          `SELECT SUM(cantidad * precio_unitario) AS total 
          FROM detalle_pedidos 
          WHERE id_pedido = ?`,
          [id]
        );
        
        await connection.query(
          `UPDATE pedidos SET total = ? WHERE id_pedido = ?`,
          [totalCalculado[0].total || 0, id]
        );
      }

      await connection.commit();
      return this.obtenerPedidoConDetalles(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async eliminarPedido(id) {
    const [result] = await pool.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    return result.affectedRows > 0;
  }

  async obtenerPedidosPorEstado(estado) {
    const [rows] = await pool.query('SELECT * FROM pedidos WHERE estado = ?', [estado]);
    return rows;
  }

  async obtenerPedidoConDetalles(id) {
    const pedido = await this.obtenerPedidoPorId(id);
    const [detalles] = await pool.query(
      `SELECT * FROM detalle_pedidos WHERE id_pedido = ?`,
      [id]
    );
    return { ...pedido, detalles };
  }
}

module.exports = new PedidoService();