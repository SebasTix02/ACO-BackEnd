const ubicacionService = require('../services/ubicacionesTemporales.service');

exports.obtenerUbicaciones = async (req, res, next) => {
  try {
    const ubicaciones = await ubicacionService.listarUbicaciones();
    res.json(ubicaciones);
  } catch (error) {
    next(error);
  }
};

exports.obtenerUbicacion = async (req, res, next) => {
  try {
    const ubicacion = await ubicacionService.obtenerUbicacionPorId(req.params.id);
    ubicacion ? res.json(ubicacion) : res.status(404).json({ mensaje: 'Ubicación no encontrada' });
  } catch (error) {
    next(error);
  }
};

exports.crearUbicacion = async (req, res, next) => {
  try {
    const nuevaUbicacion = await ubicacionService.crearUbicacion(req.body);
    res.status(201).json(nuevaUbicacion);
  } catch (error) {
    next(error);
  }
};

exports.actualizarUbicacion = async (req, res, next) => {
  try {
    const ubicacionActualizada = await ubicacionService.actualizarUbicacion(req.params.id, req.body);
    ubicacionActualizada ? res.json(ubicacionActualizada) : res.status(404).json({ mensaje: 'Ubicación no encontrada' });
  } catch (error) {
    next(error);
  }
};

exports.eliminarUbicacion = async (req, res, next) => {
    try {
      const ubicacionEliminada = await ubicacionService.eliminarUbicacion(req.params.id);
      ubicacionEliminada ? res.json(ubicacionEliminada) : res.status(404).json({ mensaje: 'Ubicación no encontrada' });
    } catch (error) {
      next(error);
    }
  };

exports.obtenerPorCliente = async (req, res, next) => {
  try {
    const ubicaciones = await ubicacionService.obtenerPorCliente(req.params.codCliente);
    res.json(ubicaciones);
  } catch (error) {
    next(error);
  }
};