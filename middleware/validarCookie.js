const jwt = require('jsonwebtoken');

// validarCookie.js (backend)
const validarCookie = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ ok: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    // Limpiar cookie con mismas opciones que en login
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'None',
      domain: '192.168.100.52'
    });
    return res.status(401).json({ ok: false });
  }
};

module.exports = validarCookie;