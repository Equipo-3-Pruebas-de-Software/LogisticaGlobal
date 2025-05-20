const db = require('../config/db');

const crearJefeTurno = (rut, nombre, clave, callback) => {
  const query = `INSERT IGNORE INTO jefes_turno (rut, nombre, clave) VALUES (?, ?, ?)`;
  db.query(query, [rut, nombre, clave], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = { crearJefeTurno };
