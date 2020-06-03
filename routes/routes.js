const express = require('express');
const router = express.Router();

const race = require("../api/race/race.index");
const leg = require("../api/leg/leg.index");

router
    .use('/race', race)
    .use('/leg', leg)

module.exports = router;