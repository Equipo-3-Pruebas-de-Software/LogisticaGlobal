const express = require('express');
const router = express.Router();
const { getTecnicos , getAllTecnicos} = require('../controllers/tecnicosController');

router.get('/', getTecnicos);
router.get('/all', getAllTecnicos);

module.exports = router;