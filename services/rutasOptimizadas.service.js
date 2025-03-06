const pool = require('../config/db');

class RutaOptimizadaService {
  async listarRutas() {
    const [rows] = await pool.query('SELECT * FROM rutas_optimizadas');
    return rows;
  }

  async obtenerRutaPorId(id) {
    const [rows] = await pool.query('SELECT * FROM rutas_optimizadas WHERE id_ruta = ?', [id]);
    return rows[0];
  }

  async crearRuta(rutaData) {
    const [result] = await pool.query(
      'INSERT INTO rutas_optimizadas (estado, distancia_total, tiempo_estimado, geojson) VALUES (?, ?, ?, ?)',
      [rutaData.estado, rutaData.distancia_total, rutaData.tiempo_estimado, rutaData.geojson]
    );
    return this.obtenerRutaPorId(result.insertId);
  }

  async actualizarRuta(id, rutaData) {
    const campos = [];
    const valores = [];
    
    // Mapear campos permitidos
    const camposPermitidos = {
      estado: 'estado',
      distancia_total: 'distancia_total',
      tiempo_estimado: 'tiempo_estimado',
      geojson: 'geojson'
    };
  
    // Construir dinámicamente los campos
    Object.entries(rutaData).forEach(([key, value]) => {
      if (camposPermitidos[key]) {
        campos.push(`${camposPermitidos[key]} = ?`);
        // Convertir GeoJSON a string si es necesario
        valores.push(key === 'geojson' ? JSON.stringify(value) : value);
      }
    });
  
    if (campos.length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }
  
    const query = `UPDATE rutas_optimizadas 
                   SET ${campos.join(', ')} 
                   WHERE id_ruta = ?`;
    
    valores.push(id);
  
    await pool.query(query, valores);
    return this.obtenerRutaPorId(id);
  }

  async eliminarRuta(id) {
    await pool.query('DELETE FROM rutas_optimizadas WHERE id_ruta = ?', [id]);
    return true;
  }

  async obtenerRutasPorEstado(estado) {
    const [rows] = await pool.query('SELECT * FROM rutas_optimizadas WHERE estado = ?', [estado]);
    return rows;
  }
  async actualizarEstadoPedidosPorRuta(idRuta, nuevoEstado) {
    // Validar estado permitido
    const estadosPermitidos = ['PENDIENTE', 'EN_RUTA', 'COMPLETADO', 'CANCELADO'];
    if (!estadosPermitidos.includes(nuevoEstado.toUpperCase())) {
      throw new Error('Estado no válido');
    }
  
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // Actualizar estado de los pedidos
      await connection.query(
        `UPDATE pedidos 
         SET estado = ?
         WHERE id_ruta = ?`,
        [nuevoEstado.toUpperCase(), idRuta]
      );
  
      // Obtener pedidos actualizados
      const [pedidos] = await connection.query(
        'SELECT * FROM pedidos WHERE id_ruta = ?',
        [idRuta]
      );
  
      await connection.commit();
      return pedidos;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new RutaOptimizadaService();