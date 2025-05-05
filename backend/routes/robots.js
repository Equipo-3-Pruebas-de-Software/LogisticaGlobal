const express = require('express');
const router = express.Router();
const { getAllRobots } = require('../controllers/robotsController');

router.get('/', getAllRobots);

module.exports = router;