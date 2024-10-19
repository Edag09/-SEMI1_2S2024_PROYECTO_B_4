const express = require('express');
const { translateText } = require('../controller/translator.controller.js');

const router = express.Router();

router.post('/', translateText);

module.exports = router;
