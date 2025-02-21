const config = require('../config');
const ACO = require('../algorithms/ACO');
const OpenRouteService = require('../services/openRouteService');

class RouteOptimizationService {
  constructor() {
    this.openRouteService = new OpenRouteService();
    this.aco = new ACO();
  }

  async optimizeRoute(startCoordinates, locations) {
    // Format locations
    const formattedLocations = locations.map(loc => [loc.lng, loc.lat]);
    formattedLocations.unshift(startCoordinates);
    formattedLocations.push(startCoordinates);

    // Get distance and duration matrices
    const matrixData = await this.openRouteService.getMatrix(formattedLocations);
    
    // Optimize route using ACO
    const { mejorRuta, mejorDistancia, mejorDuracion } = this.aco.ajustar(
      matrixData.distances,
      matrixData.durations,
      config.aco.numeroHormigas,
      config.aco.maxIteraciones,
      config.aco.beta,
      config.aco.zeta,
      config.aco.rho,
      config.aco.q0,
      true
    );

    // Get best route coordinates
    const bestRouteCoordinates = mejorRuta.map(index => formattedLocations[index]);
    
    // Get detailed route data
    const routeData = await this.openRouteService.getDirections(bestRouteCoordinates);

    return {
      mejorRuta: mejorRuta,
      mejoresCoordenadasRuta: bestRouteCoordinates,
      mejorDistancia: mejorDistancia,
      mejorDuracion: mejorDuracion,
      datosRuta: routeData
    };
  }
}

module.exports = new RouteOptimizationService();