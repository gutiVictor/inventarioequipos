const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'gestion_alquiler_maquinaria'
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    return;
  }
  console.log('¡Conectado a MySQL!');
  connection.end();
});