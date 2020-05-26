const express = require('express');
const controller = require('./race.controller')

const router = express.Router();

router
    .get('/', controller.getRaces)
    .post('/', controller.updateRaceData)
    .post('/create', controller.createRace)
    .post('/start/:id', controller.startRace)
    .post('/stop/:id', controller.stopRace)
    .post('/delete/:id', controller.deleteRace)

module.exports = router;