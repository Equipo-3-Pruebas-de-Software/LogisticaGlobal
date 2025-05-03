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

module.exports = {
  addRobotToIncidente,
  readIncidenteRobotsTecnicos
};
