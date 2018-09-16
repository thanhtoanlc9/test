const express = require('express');
const validator = require('validator');
const passport = require('passport');
var member = require('./member');

const router = new express.Router();


router.post('/', member.create);

module.exports = router;