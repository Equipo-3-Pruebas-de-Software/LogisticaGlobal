const express = require('express');
const router = express.Router();
const { getTecnicos, getAllTecnicos, getRobotsAsignados } = require('../controllers/tecnicosController');


router.get('/', getTecnicos);
router.get('/all', getAllTecnicos);
router.get('/robots-asignados/:rut', getRobotsAsignados);


module.exports = router;