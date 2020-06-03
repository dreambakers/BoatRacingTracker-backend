const express = require('express');
const controller = require('./leg.controller')

const router = express.Router();

router
    .post('/:id', controller.create)
    .post('/stop/:id', controller.stop)

module.exports = router;