'use strict';

var express = require('express');
var controller = require('./project.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/name/:projectName', controller.getName);
router.get('/versions/:drupalVersion/:projectName', controller.versions);
router.post('/', controller.make);

module.exports = router;
