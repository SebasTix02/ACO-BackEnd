const routeOptimizationService = require('../services/routeOptimization.service');

exports.optimizeRoute = async (req, res, next) => {
  try {
    const { coordenadasInicio, ubicaciones } = req.body;
    
    const result = await routeOptimizationService.optimizeRoute(coordenadasInicio, ubicaciones);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};