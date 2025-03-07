const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios.controller');
const validarCookie = require('../middleware/validarCookie'); 
const validarPrivilegios = require('../middleware/validarPrivilegios'); 

router.get('/', validarCookie, validarPrivilegios('admin'), obtenerUsuarios);
router.get('/:id', validarCookie, validarPrivilegios('admin'), obtenerUsuario);
router.post('/', validarCookie, validarPrivilegios('admin'), crearUsuario);
router.put('/:id', validarCookie, validarPrivilegios('admin'), actualizarUsuario);
router.delete('/:id', validarCookie, validarPrivilegios('admin'), eliminarUsuario);

module.exports = router;