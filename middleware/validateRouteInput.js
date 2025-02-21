function validateRouteInput(req, res, next) {
    const { coordenadasInicio, ubicaciones } = req.body;
  
    if (!coordenadasInicio || !Array.isArray(coordenadasInicio) || coordenadasInicio.length !== 2) {
      return res.status(400).json({
        error: 'Invalid start coordinates',
        message: 'Start coordinates must be an array of [longitude, latitude]'
      });
    }
  
    if (!ubicaciones || !Array.isArray(ubicaciones)) {
      return res.status(400).json({
        error: 'Invalid locations',
        message: 'Locations must be an array of objects with lng and lat properties'
      });
    }
  
    const validLocations = ubicaciones.every(loc => 
      loc && 
      typeof loc === 'object' && 
      typeof loc.lng === 'number' && 
      typeof loc.lat === 'number'
    );
  
    if (!validLocations) {
      return res.status(400).json({
        error: 'Invalid location format',
        message: 'Each location must have numeric lng and lat properties'
      });
    }
  
    next();
  }
  
  module.exports = validateRouteInput;