const express = require('express');
const controller = require('./race.controller')

const router = express.Router();

router
    .get('/', controller.getRaces)
    .post('/', controller.updateRaceData)
    .post('/create', controller.createRace)

module.exports = router;