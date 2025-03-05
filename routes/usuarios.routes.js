const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios.controller');
const validarJWT = require('../middleware/validarJWT'); 
const validarPrivilegios = require('../middleware/validarPrivilegios'); 

router.get('/', validarJWT, validarPrivilegios('admin'), obtenerUsuarios);
router.get('/:id', validarJWT, validarPrivilegios('admin'), obtenerUsuario);
router.post('/', validarJWT, validarPrivilegios('admin'), crearUsuario);
router.put('/:id', validarJWT, validarPrivilegios('admin'), actualizarUsuario);
router.delete('/:id', validarJWT, validarPrivilegios('admin'), eliminarUsuario);

module.exports = router;