// config/db.js
const mysql = require('mysql2');
const fs = require('fs');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

fs.readFile('./config/init.sql', 'utf8', (err, sql) => {
  if (err) {
    console.error('Error al leer el archivo SQL:', err);
    return;
  }

  // Conéctate a la base de datos y ejecuta el SQL
  db.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err.stack);
      return;
    }
    console.log('Conectado a la base de datos');

    db.query(sql, (err) => {
      if (err) {
        console.error('Error al ejecutar el SQL:', err);
        return;
      }
      console.log('Base de datos inicializada correctamente');
    });
  });
});

module.exports = db;