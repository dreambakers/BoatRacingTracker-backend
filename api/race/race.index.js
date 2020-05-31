const express = require('express');
const controller = require('./race.controller')

const router = express.Router();

router
    .get('/', controller.getRaces)
    .post('/create', controller.createRace)
    .post('/:id', controller.updateRaceData)
    .post('/start/:id', controller.startRace)
    .post('/stop/:id', controller.stopRace)
    .post('/delete/:id', controller.deleteRace)
    .post('/endLeg/:id', controller.endLeg)

module.exports = router;