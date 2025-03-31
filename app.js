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
const clientesRoutes = require('./routes/clientes.routes');
const articulosRoutes = require('./routes/articulos.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const gestorErrores = require('./middleware/gestorErrores');
const WebSocket = require('ws');
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
app.use('/api/clientes', clientesRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling
app.use(gestorErrores);
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  
  // Enviar mensaje de confirmación
  ws.send('WebSocket conectado');
  
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});
module.exports = app;

/*Usuario Creado {
    "usuario": "juan_perez",
    "clave": "clave123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "privilegios": "basico"
} */