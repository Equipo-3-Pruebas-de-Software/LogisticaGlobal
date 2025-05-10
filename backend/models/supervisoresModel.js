const db = require('../config/db');

const checkFirma = (rut_supervisor, firma, callback) => {
    const query = `SELECT * FROM supervisores WHERE rut = ?`;
    db.query(query, [rut_supervisor], (err, results) => {
      if (err) {
        return callback(err);
      }
      const firma_sup = results[0].firma;
      callback(null, firma === firma_sup);
    });
};

module.exports = {
    checkFirma
};
  