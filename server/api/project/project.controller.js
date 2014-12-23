'use strict';

var _ = require('lodash');
var projectData = require('./modules.json');

// Get list of projects
exports.index = function(req, res) {
  res.json([projectData]);
};

exports.make = function(req, res) {
  console.log(req.body);
  res.json({ok:1});
};
