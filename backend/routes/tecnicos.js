const express = require('express');
const router = express.Router();
const { getTecnicos } = require('../controllers/tecnicosController');

router.get('/', getTecnicos);

module.exports = router;