const db = require('../config/db');

const findUserByCredentials = (rut, clave, callback) => {
  const queries = [
    { table: 'tecnicos', rol: 'tecnico' },
    { table: 'supervisores', rol: 'supervisor' },
    { table: 'jefes_turno', rol: 'jefe_turno' }
  ];

  const tryNext = (index) => {
    if (index >= queries.length) {
      return callback(null, null); // No se encontró el usuario
    }

    const { table, rol } = queries[index];
    const query = `
      SELECT rut, ${table === 'supervisores' ? 'firma,' : ''} nombre 
      FROM ${table} 
      WHERE rut = ? AND clave = ?
    `;

    db.query(query, [rut, clave], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        return callback(null, { ...results[0], rol });
      }

      // Intenta con la siguiente tabla
      tryNext(index + 1);
    });
  };

  tryNext(0);
};

module.exports = {
  findUserByCredentials
};
