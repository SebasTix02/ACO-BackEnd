exports.validarDatosRuta = (req, res, next) => {
    const { estado, distancia_total, tiempo_estimado, geojson } = req.body;
    
    if (!estado || !distancia_total || !tiempo_estimado || !geojson) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Todos los campos son requeridos'
      });
    }
  
    if (!['GENERADA', 'EN_PROGRESO', 'COMPLETADA'].includes(estado.toUpperCase())) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Estado no válido'
      });
    }
  
    try {
      JSON.parse(geojson); // Validar que el geojson es válido
    } catch (e) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Formato GeoJSON inválido'
      });
    }
  
    next();
  };

  exports.validarGeoJSON = (req, res, next) => {
    try {
      const geoJSON = req.body.geojson;
      
      // Validación básica de estructura
      if (!geoJSON || !geoJSON.type || !geoJSON.features) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Estructura GeoJSON inválida'
        });
      }
  
      // Limitar tamaño de features (opcional)
      if (geoJSON.features.length > 1000) {
        return res.status(413).json({
          ok: false,
          mensaje: 'Número máximo de features excedido (1000)'
        });
      }
  
      req.geoJSONValidado = geoJSON;
      next();
    } catch (error) {
      next(error);
    }
  };