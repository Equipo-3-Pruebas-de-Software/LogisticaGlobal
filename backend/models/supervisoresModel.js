const db = require('../config/db');

const checkFirma = (rut_supervisor, firma, callback) => {
    const query = `SELECT * FROM supervisores WHERE rut = ?`;
    db.query(query, [rut_supervisor], (err, results) => {
      if (err) {
        return callback(err);
      }
      const firma_sup = results[0].firma;
      callback(null, firma === firma_sup);
    });
};

const crearSupervisor = (rut, nombre, firma, clave, callback) => {
  const query = `INSERT IGNORE INTO supervisores (rut, nombre, firma, clave) VALUES (?, ?, ?, ?)`;
  db.query(query, [rut, nombre, firma, clave], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = {
    checkFirma,
    crearSupervisor
};
  