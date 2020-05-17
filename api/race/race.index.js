const express = require('express');
const controller = require('./race.controller')

const router = express.Router();

router
    .get('/', controller.getRaces)

module.exports = router;