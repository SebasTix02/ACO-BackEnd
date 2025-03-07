const app = require('./app');
const config = require('./config');

app.listen(config.port || 3000, () => {
  console.log(`Servidor corriendo en http://localhost:${config.port}`);
});