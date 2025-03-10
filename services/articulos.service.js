const pool = require('../config/db');

class ArticulosService {
    async listarArticulos() {
        const [rows] = await pool.query('SELECT * FROM articulos');
        return rows;
      }
}
module.exports = new ArticulosService();