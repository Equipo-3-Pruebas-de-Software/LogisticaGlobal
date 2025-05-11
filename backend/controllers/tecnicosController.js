const { getTecnicosDisponibles , readAllTecnicos } = require('../models/tecnicosModel');
const db = require('../config/db');

const getTecnicos = (req, res) => {
  getTecnicosDisponibles((err, tecnicos) => {
    if (err) {
      console.error('Error fetching tecnicos:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tecnicos);
  });
};

const getAllTecnicos = async (req, res) => {
  try {
    const incidentes = await readAllTecnicos();
    res.status(200).json(incidentes);
  } catch (error) {
    console.error('Error al obtener robots:', error);
    res.status(500).json({ message: 'Error al obtener los robots' });
  }
};

const getRobotsAsignados = (req, res) => { //para buscar los robots asignados a un tecnico
  const rutTecnico = req.params.rut;

  const query = `
    SELECT r.id_robot, r.lugar_trabajo, r.estado, i.id_incidentes
    FROM incidentes_robots_tecnicos irt
    JOIN robots r ON irt.id_robot = r.id_robot
    JOIN incidentes i ON irt.id_incidente = i.id_incidentes
    WHERE irt.rut_tecnico = ? AND i.estado IN ('Técnico asignado', 'En reparación');
  `;

  db.query(query, [rutTecnico], (err, results) => {
    if (err) {
      console.error("Error al obtener robots asignados:", err);
      return res.status(500).json({ error: 'Error de base de datos' });
    }

    res.json(results);
  });
};


module.exports = {
  getTecnicos,
  getAllTecnicos,
  getRobotsAsignados
};