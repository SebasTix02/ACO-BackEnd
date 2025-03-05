const routeOptimizationService = require('../services/optimizacionRutas.service');

exports.optimizarRuta = async (req, res, next) => {
  try {
    const { coordenadasInicio, ubicaciones } = req.body;
    
    const result = await routeOptimizationService.optimizarRuta(coordenadasInicio, ubicaciones);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};