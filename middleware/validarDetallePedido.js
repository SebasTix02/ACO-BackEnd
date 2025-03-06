const pool = require('../config/db');

exports.validarDetallePedido = async (req, res, next) => {
  const { id_pedido, cod_art, cantidad, precio_unitario } = req.body;
  const errores = [];

  if (!id_pedido) errores.push('ID de pedido requerido');
  if (!cod_art) errores.push('Código de artículo requerido');
  if (!cantidad || cantidad <= 0) errores.push('Cantidad inválida');
  if (!precio_unitario || precio_unitario <= 0) errores.push('Precio unitario inválido');

  if (errores.length > 0) {
    return res.status(400).json({ ok: false, mensaje: errores.join(', ') });
  }

  try {
    // Verificar existencia del pedido y artículo
    const [pedido] = await pool.query('SELECT 1 FROM pedidos WHERE id_pedido = ?', [id_pedido]);
    const [articulo] = await pool.query('SELECT 1 FROM articulos WHERE cod_art = ?', [cod_art]);
    
    if (!pedido.length || !articulo.length) {
      return res.status(404).json({ 
        ok: false, 
        mensaje: 'Pedido o artículo no encontrado' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};