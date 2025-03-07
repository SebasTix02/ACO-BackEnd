const express = require('express');
const router = express.Router();
const { login, logout, checkSession } = require('../controllers/auth.controller');
const validarCookie = require('../middleware/validarCookie');

router.post('/login', login);
router.post('/logout', logout);
router.get('/check-session', validarCookie, checkSession);
module.exports = router;