const db = require('../config/db');

const getDashboardData = (callback) => {

  const queryTecnicos = `
    SELECT disponibilidad, COUNT(*) AS total
    FROM tecnicos
    GROUP BY disponibilidad;
  `;

  const queryRobots = `
    SELECT LOWER(estado) AS estado, COUNT(*) AS total
    FROM robots
    GROUP BY LOWER(estado);
  `;

  const queryIncidentes = `
    SELECT LOWER(estado) AS estado, COUNT(*) AS total
    FROM incidentes
    GROUP BY LOWER(estado);
  `;

  const queryPrioridades = `
    SELECT prioridad, COUNT(*) AS total
    FROM incidentes
    GROUP BY prioridad;
  `;

  const queryGravedades = `
    SELECT LOWER(gravedad) AS gravedad, COUNT(*) AS total
    FROM incidentes
    GROUP BY LOWER(gravedad);
  `;

  db.query(queryTecnicos, (err, resultsTecnicos) => {
    if (err) return callback(err);

    db.query(queryRobots, (err, resultsRobots) => {
      if (err) return callback(err);

      db.query(queryIncidentes, (err, resultsIncidentes) => {
        if (err) return callback(err);

        db.query(queryPrioridades, (err, resultsPrioridades) => {
          if (err) return callback(err);

          db.query(queryGravedades, (err, resultsGravedades) => {
            if (err) return callback(err);

            const dashboardData = {
              tecnicos: resultsTecnicos,
              robots: resultsRobots,
              incidentes: resultsIncidentes,
              prioridades: resultsPrioridades,
              gravedades: resultsGravedades
            };

            callback(null, dashboardData);
          });
        });
      });
    });
  });
};

module.exports = {
  getDashboardData
};