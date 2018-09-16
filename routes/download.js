const express = require('express');
const DownloadController = require('../controller/download.controller.js');

const date = require('../helpers/time');

// create our router
var router = express.Router();

router.route(`/bet`).get(DownloadController.memberBetToday);

module.exports = router;