const db = require('../config/db');

const getTecnicosDisponibles = (callback) => {
    const query = 'SELECT * FROM tecnicos WHERE disponibilidad = 1';
    db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  };

module.exports = { getTecnicosDisponibles };
