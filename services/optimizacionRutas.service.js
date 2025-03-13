const config = require('../config');
const ACO = require('../algoritmos/ACO');
const ServicioOpenRoute = require('./servicioOpenRoute');

class ServicioOptimizacionRutas {
  constructor() {
    this.servicioOpenRoute = new ServicioOpenRoute();
    this.aco = new ACO();
  }
  async optimizarRuta(coordenadasInicio, ubicacionesConNombres) {
    // 1. Preparar coordenadas para la matriz (incluyendo inicio y fin)
    const coordinatesForMatrix = [
      coordenadasInicio,
      ...ubicacionesConNombres.map(ubic => [ubic.lng, ubic.lat]),
      coordenadasInicio
    ];
  
    // 2. Obtener matriz de distancias
    const matrizDatos = await this.servicioOpenRoute.getMatriz(coordinatesForMatrix);
    
    // 3. Optimizar ruta
    const { mejorRuta, mejorDistancia, mejorDuracion } = this.aco.ajustar(
      matrizDatos.distances,
      matrizDatos.durations,
      config.aco.numeroHormigas,
      config.aco.maxIteraciones,
      config.aco.beta,
      config.aco.zeta,
      config.aco.rho,
      config.aco.q0,
      true
    );
  
    // 4. Mapear la ruta optimizada con los datos originales
    const rutaConNombres = mejorRuta.map(index => {
      if (index === 0 || index === coordinatesForMatrix.length - 1) {
        return {
          lng: coordenadasInicio[0],
          lat: coordenadasInicio[1],
          nombre_cliente: 'INICIO'
        };
      }
      return ubicacionesConNombres[index - 1]; // Ajustar índice por el inicio
    });
    // 5. Obtener GeoJSON con nombres
    const datosRuta = await this.servicioOpenRoute.getDirecciones(rutaConNombres);
  
    return {
      mejorRuta: mejorRuta,
      mejorDistancia: mejorDistancia,
      mejorDuracion: mejorDuracion,
      datosRuta: datosRuta
    };
  }
}

module.exports = new ServicioOptimizacionRutas();