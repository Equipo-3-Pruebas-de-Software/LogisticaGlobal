const db = require('../config/db');

const checkFirma = (rut_supervisor, firma, callback) => {
    const query = `SELECT * FROM supervisores WHERE rut = ? AND activo = 1`;
    db.query(query, [rut_supervisor], (err, results) => {
      if (err) {
        return callback(err);
      }
      const firma_sup = results[0].firma;
      callback(null, firma === firma_sup);
    });
};

const crearSupervisor = (rut, nombre, firma, clave, callback) => {
  const query = `INSERT IGNORE INTO supervisores (rut, nombre, firma, clave) VALUES (?, ?, ?, ?)`;
  db.query(query, [rut, nombre, firma, clave], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

const actualizarSupervisor = (rut, firma, clave, callback) => {
  let query = `
    UPDATE supervisores SET 
  `;
  let args = [];
  console.log(1);
  if (firma) {
    query += `firma = ?`;
    args.push(firma);
    console.log(2);
    if (clave) {
      query += `, clave = ?`;
      args.push(clave);
      console.log(3);
    }
  } else if (clave) {
    query += `clave = ?`;
    args.push(clave);
    console.log(4);
  }
  query += ` WHERE rut = ?`;
  args.push(rut);
  console.log(query);
  console.log(args);
  db.query(query, args, (err, result) => {
    if (err) {
      console.log(err);
      return callback(err);
    }
    callback(null, result);
  });
};

const borrarSupervisor = (rut, callback) => {
  const query = `
    UPDATE supervisores SET activo = 0 WHERE rut = ?
  `;
  db.query(query, rut, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

const readAllSupervisores = (callback) => {
  const query = `
    SELECT * FROM supervisores
  `;
  db.query(query, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = {
    checkFirma,
    crearSupervisor,
    actualizarSupervisor,
    borrarSupervisor,
    readAllSupervisores
};
  