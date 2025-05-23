const db = require('../config/db');

const updateEstadoRobot = (id_robot, estado, callback) => {
  const query = `
    UPDATE robots SET estado = ? WHERE id_robot = ?
  `;
  db.query(query, [estado, id_robot], callback);
};

const readAllRobots = () => {
  const query = 'SELECT * FROM robots WHERE activo = 1';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  updateEstadoRobot,
  readAllRobots
};
