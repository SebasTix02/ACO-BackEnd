const config = require('../config');
const ACO = require('../algoritmos/ACO');
const ServicioOpenRoute = require('./servicioOpenRoute');

class ServicioOptimizacionRutas {
  constructor() {
    this.servicioOpenRoute = new ServicioOpenRoute();
    this.aco = new ACO();
  }

  async optimizarRuta(coordenadasInicio, ubicaciones) {
    // Format ubicaciones
    const UbicacionesConFormato = ubicaciones.map(loc => [loc.lng, loc.lat]);
    UbicacionesConFormato.unshift(coordenadasInicio);
    UbicacionesConFormato.push(coordenadasInicio);

    // Get distance and duration matrices
    const matrizDatos = await this.servicioOpenRoute.getMatriz(UbicacionesConFormato);
    
    // Optimize route using ACO
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

    // Get best route coordinates
    const mejoresCoordenadasDeRuta = mejorRuta.map(index => UbicacionesConFormato[index]);
    
    // Get detailed route data
    const datosRuta = await this.servicioOpenRoute.getDirecciones(mejoresCoordenadasDeRuta);

    return {
      mejorRuta: mejorRuta,
      mejoresCoordenadasRuta: mejoresCoordenadasDeRuta,
      mejorDistancia: mejorDistancia,
      mejorDuracion: mejorDuracion,
      datosRuta: datosRuta
    };
  }
}

module.exports = new ServicioOptimizacionRutas();