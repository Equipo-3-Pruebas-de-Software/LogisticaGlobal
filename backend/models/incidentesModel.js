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
    SET supervisor_asignado = ?, prioridad = ?, gravedad = ?, fecha_tecnico_asignado = CURRENT_TIMESTAMP, estado = 'técnico asignado'
    WHERE id_incidentes = ?
  `;
  db.query(query, [supervisor_asignado, prioridad, gravedad, id_incidente], callback);
};


const readIncidente = (id_incidente, callback) => {
  const query = 'SELECT * FROM incidentes WHERE id_incidentes = ?';
  db.query(query, [id_incidente], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0] || null);
  });
};

const readAllIncidentes = () => {
  const query = 'SELECT * FROM incidentes';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const setFechaEsperaAprovacion = (id_incidente, callback) => {
  const query = `
    UPDATE incidentes
    SET fecha_espera_aprovacion = CURRENT_TIMESTAMP, estado = "En espera de aprobación"
    WHERE id_incidentes = ?
  `;
  db.query(query, [id_incidente], callback);
};

const resolveIncidente = (id_incidente, callback) => {
  const query = `
    UPDATE incidentes
    SET estado = 'resuelto', firmado = 1, fecha_resuelto = CURRENT_TIMESTAMP
    WHERE id_incidentes = ?
  `;
  db.query(query, [id_incidente], callback);
}


module.exports = {
  createIncidente,
  updateIncidenteAsignacion,
  readIncidente,
  readAllIncidentes,
  setFechaEsperaAprovacion,
  resolveIncidente
};

