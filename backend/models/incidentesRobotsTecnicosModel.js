const db = require('../config/db');

const addRobotToIncidente = (id_robot, id_incidente, callback) => {
  const query = `
    INSERT INTO incidentes_robots_tecnicos (id_robot, id_incidente)
    VALUES (?, ?)
  `;
  db.query(query, [id_robot, id_incidente], callback);
};

module.exports = { addRobotToIncidente };
