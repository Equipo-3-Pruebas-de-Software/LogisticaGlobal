const db = require('../config/db');

// Crear un nuevo reporte
const createReporte = ({ id_reporte, id_incidente, rut_jefe_turno, contenido, fecha_reporte }, callback) => {
  const query = `
    INSERT INTO reportes (id_reporte, id_incidente, rut_jefe_turno, contenido, fecha_reporte)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `;
  db.query(query, [id_reporte, id_incidente, rut_jefe_turno, contenido, fecha_reporte], (err, result) => {
    if (err) return callback(err);
    callback(null, result.insertId);
  });
};

// Obtener un solo reporte
const getReporteById = (id, callback) => {
  const query = 'SELECT * FROM reportes WHERE id_reporte = ?';
  db.query(query, [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0] || null);
  });
};

// Obtener todos los reportes
const getAllReportes = () => {
  const query = 'SELECT * FROM reportes ORDER BY fecha_reporte DESC';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  createReporte,
  getReporteById,
  getAllReportes
};
