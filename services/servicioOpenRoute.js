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

  async getDirecciones(orderedUbicaciones) {
    try {
      const coordinates = orderedUbicaciones.map(ubic => {
        if (Array.isArray(ubic)) return ubic;
        return [ubic.lng, ubic.lat];
      });
  
      const response = await axios.post(
        config.openRouteService.directionsUrl,
        {
          coordinates,
          profile: 'driving-car',
          format: 'geojson'
        },
        { headers: this.headers }
      );
  
      const geojson = response.data;
      const allCoordinates = geojson.features[0].geometry.coordinates;
      // Suponemos que el arreglo "coordinates" viene así: [inicio, punto1, ..., puntoN, inicio]
      // Por ello, el último punto de entrega es el penúltimo elemento:
      const lastDelivery = coordinates[coordinates.length - 2];
  
      // Función para calcular la distancia Euclidiana entre dos coordenadas
      const calcDistance = (a, b) => {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
      };
  
      // Buscar en el arreglo de la ruta la posición (índice) más cercana al último punto de entrega
      let indexClosest = 0;
      let minDistance = Infinity;
      for (let i = 0; i < allCoordinates.length; i++) {
        const d = calcDistance(allCoordinates[i], lastDelivery);
        if (d < minDistance) {
          minDistance = d;
          indexClosest = i;
        }
      }
  
      // Definir la ruta de ida y de retorno basándonos en ese índice
      const rutaIda = allCoordinates.slice(0, indexClosest + 1);
      const rutaRetorno = allCoordinates.slice(indexClosest);
  
      // Crear dos features con colores distintos: ida en rojo y retorno en verde
      const rutas = [
        {
          type: 'Feature',
          properties: { tipo: 'ida', color: '#00AA00' },
          geometry: {
            type: 'LineString',
            coordinates: rutaIda
          }
        },
        {
          type: 'Feature',
          properties: { tipo: 'retorno', color: '#325EA9' },
          geometry: {
            type: 'LineString',
            coordinates: rutaRetorno
          }
        }
      ];
  
      // Crear marcadores con numeración y estilo adecuado
      const markers = orderedUbicaciones.map((ubicacion, index) => {
        const esInicio = index === 0;
        const esFin = index === orderedUbicaciones.length - 1;
        
        // Determinar el número de orden excluyendo inicio y fin
        const numeroOrden = esInicio || esFin ? null : index;
        
        // Construir el texto del marcador
        let textoMarcador;
        if (esInicio) {
          textoMarcador = 'INICIO';
        } else if (esFin) {
          textoMarcador = 'FIN';
        } else {
          textoMarcador = `${numeroOrden-1}. ${ubicacion.nombre_cliente || 'Sin nombre'}`;
        }
  
        return {
          type: 'Feature',
          properties: {
            name: textoMarcador,
            "marker-color": esInicio ? '#00FF00' : 
                           esFin ? '#FFA500' : 
                           '#FF0000',
            "numero-orden": numeroOrden,
            "nombre-cliente": ubicacion.nombre_cliente
          },
          geometry: {
            type: 'Point',
            coordinates: coordinates[index]
          }
        };
      });
  
      geojson.features = [...rutas, ...markers];
      
      return geojson;
    } catch (error) {
      throw new ErroresServicioOpenRoute('Error Obteniendo Direcciones', error);
    }
  }
}

module.exports = ServicioOpenRoute;