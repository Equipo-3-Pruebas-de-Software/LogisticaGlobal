const { getTecnicosDisponibles , readAllTecnicos } = require('../models/tecnicosModel');

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


module.exports = {
  getTecnicos,
  getAllTecnicos
};