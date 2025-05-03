const db = require('../config/db');

const createIncidente = ({ lugar, descripcion }, callback) => {
  const query = `
    INSERT INTO incidentes (lugar, descripcion, estado, fecha_creado, firmado)
    VALUES (?, ?, 'creado', CURRENT_TIMESTAMP, 0)
  `;
  db.query(query, [lugar, descripcion], (err, result) => {
    if (err) return callback(err);
    callback(null, result.insertId); // return id_incidentes
  });
};


const updateIncidenteAsignacion = ({id_incidente, supervisor_asignado, prioridad, gravedad }, callback) => {
  const query = `
    UPDATE incidentes
    SET supervisor_asignado = ?, prioridad = ?, gravedad = ?
    WHERE id_incidentes = ?
  `;
  db.query(query, [supervisor_asignado, prioridad, gravedad, id_incidente], callback);
};

module.exports = {
  createIncidente,
  updateIncidenteAsignacion
};

