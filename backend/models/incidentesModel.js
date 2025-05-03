const db = require('../config/db');

const createIncidente = ({ lugar, descripcion }, callback) => {
  const query = `
    INSERT INTO incidentes (lugar, descripcion, estado, fecha_incidente)
    VALUES (?, ?, 'creado', CURRENT_TIMESTAMP)
  `;
  db.query(query, [lugar, descripcion], (err, result) => {
    if (err) return callback(err);
    callback(null, result.insertId); // return id_incidentes
  });
};

module.exports = { createIncidente };
