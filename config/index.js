require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  openRouteService: {
    apiKey: process.env.ORS_API_KEY || '5b3ce3597851110001cf624879a425c6cf81444baa5df8b1c0a84e87',
    matrixUrl: 'https://api.openrouteservice.org/v2/matrix/driving-car',
    directionsUrl: 'https://api.openrouteservice.org/v2/directions/driving-car/geojson'
  },
  aco: {
    numeroHormigas: 10,
    maxIteraciones: 1000,
    beta: 4,
    zeta: 0.4,
    rho: 0.2,
    q0: 0.7
  }
};