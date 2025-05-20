const db = require('../config/db');

const getTecnicosDisponibles = (callback) => {
  const query = 'SELECT * FROM tecnicos WHERE disponibilidad = 1';
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const crearTecnico = (rut, nombre, clave, callback) => {
  const query = 'INSERT IGNORE INTO tecnicos (rut, nombre, disponibilidad, clave) VALUES (?, ?, 1, ?)';
  db.query(query, [rut, nombre, clave], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};
const setDisponibilidad = (rut_tecnico, disponibilidad, callback) => {
  const query = 'UPDATE tecnicos SET disponibilidad = ? WHERE rut = ?';
  db.query(query, [disponibilidad, rut_tecnico], callback);
};

const readAllTecnicos = () => {
  const query = 'SELECT * FROM tecnicos';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { 
  getTecnicosDisponibles,
  setDisponibilidad,
  readAllTecnicos,
  crearTecnico
};
