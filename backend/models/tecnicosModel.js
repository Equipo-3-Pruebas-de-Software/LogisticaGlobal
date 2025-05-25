const db = require('../config/db');

const getTecnicosDisponibles = (callback) => {
  const query = 'SELECT * FROM tecnicos WHERE disponibilidad = 1 AND activo = 1';
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
  const query = 'SELECT * FROM tecnicos WHERE activo = 1';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const actualizarTecnico = (rut, clave, callback) => {
  const query = `
    UPDATE tecnicos SET clave = ? WHERE rut = ?
  `;
  db.query(query, [clave, rut], (err, result) => {
    if (err) {
      console.log(2);
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = { 
  getTecnicosDisponibles,
  setDisponibilidad,
  readAllTecnicos,
  crearTecnico,
  actualizarTecnico
};
