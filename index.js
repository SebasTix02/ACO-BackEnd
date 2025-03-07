const app = require('./app');
const config = require('./config');

// Escuchar en todas las interfaces de red
app.listen(config.port || 3000, '0.0.0.0', () => {
  console.log(`Servidor accesible en:
  - Local: http://localhost:${config.port}
  - Red: http://${getLocalIp()}:${config.port}`);
});

// Función para obtener tu IP local
function getLocalIp() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // Ej: 192.168.1.100
      }
    }
  }
  return '0.0.0.0';
}