const db = require('../config/db');

const crearRobot = (lugar_trabajo, callback) => {
  const estado = 'operativo';
  const activo = 1; // Asumiendo que el robot está activo al crearlo
  const query = `
    INSERT INTO robots (lugar_trabajo, estado, activo)
    VALUES (?, ?, ?)
  `;

  db.query(query, [lugar_trabajo, estado, activo], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

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

const updateLugarRobot = (id_robot, lugar, callback) => {
  const query = `
    UPDATE robots SET lugar_trabajo = ? WHERE id_robot = ?
  `;
  db.query(query, [lugar, id_robot], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

const deleteRobot = (id_robot, callback) => {
  const query = `
    UPDATE robots SET activo = 0 WHERE id_robot = ?
  `;
  db.query(query, id_robot, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
}

module.exports = {
  crearRobot,
  updateEstadoRobot,
  readAllRobots,
  updateLugarRobot,
  deleteRobot
};
