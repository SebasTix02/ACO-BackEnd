const axios = require('axios');
const config = require('../config');
const { OpenRouteServiceError } = require('../utils/errors');

class OpenRouteService {
  constructor() {
    this.headers = {
      'Authorization': config.openRouteService.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getMatrix(locations) {
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
      throw new OpenRouteServiceError('Error getting distance matrix', error);
    }
  }

  async getDirections(coordinates) {
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
      throw new OpenRouteServiceError('Error getting directions', error);
    }
  }
}

module.exports = OpenRouteService;