const { getTecnicosDisponibles } = require('../models/tecnicosModel');

const getTecnicos = (req, res) => {
  getTecnicosDisponibles((err, tecnicos) => {
    if (err) {
      console.error('Error fetching tecnicos:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tecnicos);
  });
};

module.exports = { getTecnicos };