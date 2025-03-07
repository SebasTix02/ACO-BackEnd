const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const rutasOptimizadasRoutes = require('./routes/rutasOptimizadas.routes');
const ubicacionesRoutes = require('./routes/ubicacionesTemporales.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const detallePedidosRoutes = require('./routes/detallePedidos.routes');
const gestorErrores = require('./middleware/gestorErrores');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
  origin: true, // Permitir cualquier origen
  credentials: true,
  exposedHeaders: ['set-cookie'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/rutas', rutasOptimizadasRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/detalle_pedidos', detallePedidosRoutes);

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