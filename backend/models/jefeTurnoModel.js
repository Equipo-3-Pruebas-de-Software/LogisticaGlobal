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

const actualizarJefeTurno = (rut, clave, callback) => {
  const query = `
    UPDATE jefes_turno SET clave = ? WHERE rut = ?
  `;
  db.query(query, [clave, rut], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

const borrarJefeTurno = (rut, callback) => {
  const query = `
    UPDATE jefes_turno SET activo = 0 WHERE rut = ?
  `;
  db.query(query, rut, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = {
  crearJefeTurno,
  actualizarJefeTurno,
  borrarJefeTurno
};
