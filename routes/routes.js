const express = require('express');
const router = express.Router();

const race = require("../api/race/race.index");

router
    .use('/race', race)

module.exports = router;