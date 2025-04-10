const express = require('express');
const cors = require('cors');
const sucursalRoutes = require('./routes/sucursal.routes');
const clienteRoutes = require('./routes/cliente.routes');
const alquilerRoutes = require('./routes/alquiler.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const articuloRoutes = require('./routes/articulo.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const alquilerDetallesRoutes = require('./routes/alquiler_detalles.routes');
const historicoEstadoRoutes = require('./routes/historico_estado.routes');
const mantenimientoRoutes = require('./routes/mantenimiento.routes');
const reservaRoutes = require('./routes/reserva.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Routes
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/alquileres', alquilerRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/articulos', articuloRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/alquiler-detalles', alquilerDetallesRoutes);
app.use('/api/historico-estados', historicoEstadoRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/reservas', reservaRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  } else {
    console.error('Server error:', err);
  }
 
});