'use strict';

var _ = require('lodash');
var projectData = require('./modules.json');

// Get list of projects
exports.index = function(req, res) {
  res.json([projectData]);
};
