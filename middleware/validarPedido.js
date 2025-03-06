const pool = require('../config/db');

exports.validarPedido = async (req, res, next) => {
  const { cod_cliente, id_ubicacion, total } = req.body;
  const errores = [];
  
  // Validaciones básicas
  if (!cod_cliente) errores.push('Código de cliente requerido');
  if (!id_ubicacion) errores.push('Ubicación requerida');
  if (!total || isNaN(total)) errores.push('Total inválido');

  if (errores.length > 0) {
    return res.status(400).json({ ok: false, mensaje: errores.join(', ') });
  }

  try {
    // Validar existencia de referencias
    const [cliente] = await pool.query('SELECT 1 FROM clientes WHERE cod_cliente = ?', [cod_cliente]);
    const [ubicacion] = await pool.query('SELECT 1 FROM ubicaciones_temporales WHERE id_ubicacion = ?', [id_ubicacion]);
    
    if (!cliente.length || !ubicacion.length) {
      return res.status(404).json({ 
        ok: false, 
        mensaje: 'Cliente o ubicación no encontrados' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.validarEstadoPedido = (req, res, next) => {
  const estadosPermitidos = ['PENDIENTE', 'EN_RUTA', 'COMPLETADO', 'CANCELADO'];
  if (req.body.estado && !estadosPermitidos.includes(req.body.estado.toUpperCase())) {
    return res.status(400).json({
      ok: false,
      mensaje: `Estado no válido. Permitidos: ${estadosPermitidos.join(', ')}`
    });
  }
  next();
};