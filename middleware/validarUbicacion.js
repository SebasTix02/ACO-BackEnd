const pool = require('../config/db');

exports.validarDatosUbicacion = async (req, res, next) => {
  const { cod_cliente, latitud, longitud } = req.body;
  const errores = [];

  if (!cod_cliente) errores.push('Código de cliente es requerido');
  if (!latitud) errores.push('Latitud es requerida');
  if (!longitud) errores.push('Longitud es requerida');

  if (errores.length > 0) {
    return res.status(400).json({ ok: false, mensaje: errores.join(', ') });
  }

  // Validar coordenadas
  if (Math.abs(latitud) > 90 || Math.abs(longitud) > 180) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Coordenadas inválidas (lat: -90 a 90, long: -180 a 180)'
    });
  }

  // Verificar existencia del cliente
  try {
    const [cliente] = await pool.query('SELECT 1 FROM clientes WHERE cod_cliente = ?', [cod_cliente]);
    if (!cliente.length) {
      return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    }
    next();
  } catch (error) {
    next(error);
  }
};