const http = require('http');

const data = JSON.stringify({
  nombre: 'Test Article',
  codigo_barras: '123456',
  categoria_id: 1,
  sucursal_id: 1,
  estado: 'disponible',
  costo_alquiler_dia: 100,
  fecha_adquisicion: '2024-01-20',
  imagen_url: 'http://example.com/image.jpg',
  notas: 'Test notes'
});

const options = {
  hostname: 'localhost',
  port: 3006,
  path: '/api/articulos',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();