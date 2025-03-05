const axios = require('axios');
const config = require('../config');
const { ErroresServicioOpenRoute } = require('../utils/errores');

class ServicioOpenRoute {
  constructor() {
    this.headers = {
      'Authorization': config.openRouteService.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getMatriz(locations) {
    try {
      const response = await axios.post(
        config.openRouteService.matrixUrl,
        {
          locations,
          profile: 'driving-car',
          metrics: ['distance', 'duration'],
          units: 'km'
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      throw new ErroresServicioOpenRoute('Error Obteniendo matriz de distancias', error);
    }
  }

  async getDirecciones(coordinates) {
    try {
      const response = await axios.post(
        config.openRouteService.directionsUrl,
        {
          coordinates,
          profile: 'driving-car',
          format: 'geojson'
        },
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      throw new ErroresServicioOpenRoute('Error Obteniendo Direcciones', error);
    }
  }
}

module.exports = ServicioOpenRoute;