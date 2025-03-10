const pool = require('../config/db');

class ClientesService {
    async listarClientes() {
        const [rows] = await pool.query('SELECT * FROM clientes');
        return rows;
      }
}
module.exports = new ClientesService();