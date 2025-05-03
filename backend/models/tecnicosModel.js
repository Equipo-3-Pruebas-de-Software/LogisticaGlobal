const db = require('../config/db');

const getTecnicosDisponibles = (callback) => {
  const query = 'SELECT * FROM tecnicos WHERE disponibilidad = 1';
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const setDisponibilidad = (rut_tecnico, disponibilidad, callback) => {
  const query = 'UPDATE tecnicos SET disponibilidad = ? WHERE rut = ?';
  db.query(query, [disponibilidad, rut_tecnico], callback);
};


module.exports = { 
  getTecnicosDisponibles,
  setDisponibilidad
};
