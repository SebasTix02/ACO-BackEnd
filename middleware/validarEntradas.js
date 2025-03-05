function validarEntradas(req, res, next) {
    const { coordenadasInicio, ubicaciones } = req.body;
  
    if (!coordenadasInicio || !Array.isArray(coordenadasInicio) || coordenadasInicio.length !== 2) {
      return res.status(400).json({
        error: 'Coordenadas de inicio no válidas',
        message: 'Las coordenadas iniciales deben ser una matriz de [longitud, latitud].'
      });
    }
  
    if (!ubicaciones || !Array.isArray(ubicaciones)) {
      return res.status(400).json({
        error: 'Ubicaciones no válidas',
        message: 'Las ubicaciones deben ser una matriz de objetos con las propiedades lng y lat'
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
        error: 'Formato de ubicación no válido',
        message: 'Cada ubicación debe tener propiedades numéricas lng y lat'
      });
    }
  
    next();
  }
  
  module.exports = validarEntradas;