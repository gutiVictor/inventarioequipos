const axios = require('axios');

const testAlquiler = {
  cliente_id: 1,
  usuario_id: 1,
  fecha_inicio: '2024-01-20',
  fecha_fin: '2024-01-25',
  estado: 'pendiente',
  total: 500,
  deposito: 100,
  notas: 'Test rental'
};

axios.post('http://localhost:3000/api/alquileres', testAlquiler)
  .then(response => {
    console.log('Success:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });