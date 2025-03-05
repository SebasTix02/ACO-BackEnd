const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const gestorErrores = require('./middleware/gestorErrores');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(gestorErrores);

module.exports = app;