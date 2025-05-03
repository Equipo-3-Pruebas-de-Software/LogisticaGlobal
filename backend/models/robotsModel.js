const db = require('../config/db');

const updateEstadoRobot = (id_robot, estado, callback) => {
  const query = `
    UPDATE robots SET estado = ? WHERE id_robot = ?
  `;
  db.query(query, [estado, id_robot], callback);
};

module.exports = {
  updateEstadoRobot
};
