const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            ok: false,
            mensaje: 'No hay token en la solicitud'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Inyectar datos del usuario en el request
        req.usuario = {
            id: decoded.id,
            usuario: decoded.usuario,
            nombre: decoded.nombre,
            privilegios: decoded.privilegios
        };

        // Lógica de renovación de token (si la necesitas)
        const tiempoRestante = decoded.exp - Math.floor(Date.now() / 1000);
        if (tiempoRestante < 86400) { // 24 horas antes de expirar
            const nuevoToken = generarNuevoToken(decoded);
            res.cookie('token', nuevoToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        }

        next();
    } catch (error) {
        res.clearCookie('token');
        return res.status(401).json({
            ok: false,
            mensaje: 'Token no válido'
        });
    }
};

const generarNuevoToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};


module.exports = validarJWT;