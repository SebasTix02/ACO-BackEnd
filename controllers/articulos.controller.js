const articulosService = require('../services/articulos.service');

exports.obtenerArticulos = async (req, res, next) => {
  try {
    const articulos = await articulosService.listarArticulos();
    res.json(articulos);
  } catch (error) {
    next(error);
  }
};