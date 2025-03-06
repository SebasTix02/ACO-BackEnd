const pedidoService = require('../services/pedidos.service');

exports.obtenerPedidos = async (req, res, next) => {
  try {
    const pedidos = await pedidoService.listarPedidos();
    res.json(pedidos);
  } catch (error) {
    next(error);
  }
};

exports.obtenerPedido = async (req, res, next) => {
  try {
    const pedido = await pedidoService.obtenerPedidoPorId(req.params.id);
    pedido ? res.json(pedido) : res.status(404).json({ mensaje: 'Pedido no encontrado' });
  } catch (error) {
    next(error);
  }
};

exports.crearPedido = async (req, res, next) => {
  try {
    const nuevoPedido = await pedidoService.crearPedido(req.body);
    res.status(201).json(nuevoPedido);
  } catch (error) {
    next(error);
  }
};

exports.actualizarPedido = async (req, res, next) => {
  try {
    const pedidoActualizado = await pedidoService.actualizarPedido(req.params.id, req.body);
    pedidoActualizado ? res.json(pedidoActualizado) : res.status(404).json({ mensaje: 'Pedido no encontrado' });
  } catch (error) {
    next(error);
  }
};

exports.eliminarPedido = async (req, res, next) => {
  try {
    const resultado = await pedidoService.eliminarPedido(req.params.id);
    resultado ? res.json(resultado) : res.status(404).json({ mensaje: 'Pedido no encontrado' });
  } catch (error) {
    next(error);
  }
};

exports.obtenerPedidosPorEstado = async (req, res, next) => {
  try {
    const pedidos = await pedidoService.obtenerPedidosPorEstado(req.params.estado);
    res.json(pedidos);
  } catch (error) {
    next(error);
  }
};