const { readAllRobots } = require('../models/robotsModel');

const getAllRobots = async (req, res) => {
    try {
      const incidentes = await readAllRobots();
      res.status(200).json(incidentes);
    } catch (error) {
      console.error('Error al obtener robots:', error);
      res.status(500).json({ message: 'Error al obtener los robots' });
    }
  };
  
  module.exports = {
    getAllRobots
};