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


module.exports = {
  addRobotToIncidente,
  readIncidenteRobotsTecnicos,
  assignTecnicoToRobot
};
