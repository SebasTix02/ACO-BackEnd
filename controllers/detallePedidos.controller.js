const detalleService = require('../services/detallePedidos.service');

exports.obtenerDetallesPedido = async (req, res, next) => {
  try {
    const detalles = await detalleService.listarPorPedido(req.params.idPedido);
    res.json(detalles);
  } catch (error) {
    next(error);
  }
};

exports.obtenerDetalle = async (req, res, next) => {
  try {
    const detalle = await detalleService.obtenerDetallePorId(req.params.id);
    detalle ? res.json(detalle) : res.status(404).json({ mensaje: 'Detalle no encontrado' });
  } catch (error) {
    next(error);
  }
};

exports.crearDetalle = async (req, res, next) => {
  try {
    const nuevoDetalle = await detalleService.crearDetalle(req.body);
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    next(error);
  }
};

exports.actualizarDetalle = async (req, res, next) => {
  try {
    const detalleActualizado = await detalleService.actualizarDetalle(req.params.id, req.body);
    detalleActualizado ? res.json(detalleActualizado) : res.status(404).json({ mensaje: 'Detalle no encontrado' });
  } catch (error) {
    next(error);
  }
};

exports.eliminarDetalle = async (req, res, next) => {
  try {
    const resultado = await detalleService.eliminarDetalle(req.params.id);
    resultado ? res.status(204).send() : res.status(404).json({ mensaje: 'Detalle no encontrado' });
  } catch (error) {
    next(error);
  }
};