const rutaService = require('../services/rutasOptimizadas.service');

exports.obtenerRutas = async (req, res, next) => {
  try {
    const rutas = await rutaService.listarRutas();
    res.json(rutas);
  } catch (error) {
    next(error);
  }
};

exports.obtenerRuta = async (req, res, next) => {
  try {
    const ruta = await rutaService.obtenerRutaPorId(req.params.id);
    ruta ? res.json(ruta) : res.status(404).json({ mensaje: 'Ruta no encontrada' });
  } catch (error) {
    next(error);
  }
};

exports.crearRuta = async (req, res, next) => {
    try {
      const rutaData = {
        ...req.body,
        geojson: JSON.stringify(req.body.geojson) 
      };
      
      const nuevaRuta = await rutaService.crearRuta(rutaData);
      res.status(201).json({
        ok: true,
        id: nuevaRuta.id_ruta,
        enlace: `/api/rutas/${nuevaRuta.id_ruta}`
      });
    } catch (error) {
      next(error);
    }
  };

exports.actualizarRuta = async (req, res, next) => {
  try {
    const rutaActualizada = await rutaService.actualizarRuta(req.params.id, req.body);
    rutaActualizada ? res.json(rutaActualizada) : res.status(404).json({ mensaje: 'Ruta no encontrada' });
  } catch (error) {
    next(error);
  }
};

exports.eliminarRuta = async (req, res, next) => {
  try {
    const resultado = await rutaService.eliminarRuta(req.params.id);
    resultado ? res.json(resultado) : res.status(404).json({ mensaje: 'Ruta no encontrada' });
  } catch (error) {
    next(error);
  }
};

exports.obtenerRutasPorEstado = async (req, res, next) => {
  try {
    const rutas = await rutaService.obtenerRutasPorEstado(req.params.estado);
    res.json(rutas);
  } catch (error) {
    next(error);
  }
};