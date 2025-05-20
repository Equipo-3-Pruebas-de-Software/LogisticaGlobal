const db = require('../config/db');

const addRobotToIncidente = (id_robot, id_incidente, callback) => {
  const query = `
    INSERT INTO incidentes_robots_tecnicos (id_robot, id_incidente)
    VALUES (?, ?)
  `;
  db.query(query, [id_robot, id_incidente], callback);
};

const readIncidenteRobotsTecnicos = (id_incidente, callback) => {
  const query = 'SELECT * FROM incidentes_robots_tecnicos WHERE id_incidente = ?';
  db.query(query, [id_incidente], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const assignTecnicoToRobot = (id_incidente, id_robot, rut_tecnico, callback) => {
  const query = `
    UPDATE incidentes_robots_tecnicos
    SET rut_tecnico = ?, fecha_asignacion = CURRENT_TIMESTAMP
    WHERE id_incidente = ? AND id_robot = ?
  `;
  db.query(query, [rut_tecnico, id_incidente, id_robot], callback);
};

const getRobotsByTecnico = (rut_tecnico, callback) => {
  const query = `
    SELECT irt.id_robot, r.lugar_trabajo, r.estado, irt.id_incidente, irt.descripcion, i.estado AS estado_incidente
    FROM incidentes_robots_tecnicos irt
    JOIN robots r ON irt.id_robot = r.id_robot
    JOIN incidentes i ON irt.id_incidente = i.id_incidentes
    WHERE irt.rut_tecnico = ?
  `;

  db.query(query, [rut_tecnico], callback);
};

const addFicha = (id_incidente, id_robot, descripcion, callback) => {
  const query = `
    UPDATE incidentes_robots_tecnicos
    SET descripcion = ?
    WHERE id_robot = ? AND id_incidente = ?
  `;
  db.query(query, [descripcion, id_robot, id_incidente], callback);
};

const checkFinished = (id_incidente, callback) => {
  const query = `
    SELECT COUNT(*) AS faltantes
    FROM incidentes_robots_tecnicos
    WHERE id_incidente = ? AND descripcion IS NULL
  `;
  db.query(query, [id_incidente], (err, results) => {
    if (err) return callback(err);
    const faltantes = Number(results[0].faltantes);
    callback(null, faltantes === 0);
  });
};

const getDescripcion = (id_incidente, id_robot, rut_tecnico, callback) => {
  const query = `
    SELECT * FROM incidentes_robots_tecnicos
    WHERE id_robot = ? AND id_incidente = ? AND rut_tecnico = ?
  `; 
  db.query(query, [id_robot, id_incidente, rut_tecnico], callback);
};

module.exports = {
  addRobotToIncidente,
  readIncidenteRobotsTecnicos,
  assignTecnicoToRobot,
  getRobotsByTecnico,
  addFicha,
  checkFinished,
  getDescripcion
};

