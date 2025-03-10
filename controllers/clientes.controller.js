const clienteService = require('../services/clientes.service');

exports.obtenerClientes = async (req, res, next) => {
  try {
    const clientes = await clienteService.listarClientes();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};