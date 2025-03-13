const UbicacionTemporalService = require('../services/ubicacionesTemporales.service');
const routeOptimizationService = require('../services/optimizacionRutas.service');
exports.optimizarRuta = async (req, res, next) => {
  try {
    const { coordenadasInicio, ubicaciones } = req.body;
    
    // Obtener todos los registros de ubicaciones temporales
    const ubicacionesTemporales = await UbicacionTemporalService.listarUbicaciones();
    // Mapear nombres a las ubicaciones solicitadas
    const ubicacionesConNombres = ubicaciones.map(ubicReq => {

      const ubicacion = ubicacionesTemporales.find(
        ut => ut.id_ubicacion == ubicReq.tracking_id
      );
      return {
        ...ubicReq,
        nombre_cliente: ubicacion?.nombre_contacto || 'Sin nombre'
      };
    });
    // Pasar al servicio de optimización
    const result = await routeOptimizationService.optimizarRuta(
      coordenadasInicio,
      ubicacionesConNombres
    );
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};