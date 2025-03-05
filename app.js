const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const rutasOptimizadasRoutes = require('./routes/rutasOptimizadas.routes');
const gestorErrores = require('./middleware/gestorErrores');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/rutas', rutasOptimizadasRoutes);

// Error handling
app.use(gestorErrores);

module.exports = app;

/*Usuario Creado {
    "usuario": "juan_perez",
    "clave": "clave123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "privilegios": "basico"
} */