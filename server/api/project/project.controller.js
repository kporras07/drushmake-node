'use strict';

var _ = require('lodash');
var https = require('https');
var exec  = require('child_process').exec;
var projectData = require('./modules.json');

// Get list of projects
exports.index = function(req, res) {
  res.json([projectData]);
};

// Module get Human Name
exports.getName = function(req, res) {
  var projectName = req.params.projectName;
  var options = {
    hostname: 'www.drupal.org',
    port: 443,
    path: '/project/' + projectName,
    method:  'GET'
  };
  var str = '';
  var request = https.request(options, function(result) {
    if (result.statusCode == 200) {
      result.on('data', function(chunk) {
        str += chunk;
      });
      result.on('end', function() {
        var title = str.match(/<h1\b[^>]*>(.*?)<\/h1>/)[1];
        res.send(title);
      });
    }
    else {
      res.send('');
    }
  });
  request.end();
};

// Project get Versions
exports.versions = function(req, res) {
  var projectName = req.params.projectName;
  var drupalVersion = req.params.drupalVersion;
  exec('`which git` ls-remote http://git.drupal.org/project/' + projectName + '.git', function(error, stdout, stderr) {
    if (error) {
      return res
        .status(500)
        .send({e:[error,stderr]});
    }
    var refs,
    tags = [];
    refs  = stdout
    .split('\n')
    .filter(function(n){ return n != undefined });
    console.log(refs, 'refs');
    refs.pop();
    _.each(refs, function (tag) {
      tag = tag.split('\t')[1].split('tags/')[1];
      if (tag != undefined) {
        if (!drupalVersion || tag.lastIndexOf(drupalVersion, 0) === 0) {
          tags.push(tag.split('^{}')[0]);
        }
      }
    });
    var tagsToSend = [];
    _.each(tags, function(tag) {
      tagsToSend.push({id: tag});
    });
    return res.json(tagsToSend);
  });
};

exports.make = function(req, res) {
  // Preparing projects.
  var modules = [],
      themes = [],
      libraries = [];

  req.body.projects.forEach(function(value) {
    switch (value.projectType) {
      case 'module':
        modules.push(value);
        break
      case 'theme':
        themes.push(value);
        break;
      case 'library':
        libraries.push(value);
        break;
    }
  });

  // Replace this with option in form.
  var contribSubdir = req.body.options.contribSubdir;
  var drupalVersion = req.body.options.drupalVersion;

  var makeFile = "";
  // Core stuff here


  // Modules stuff here
  makeFile += "; Modules\n\n";

  modules.forEach(function(value) {
    makeFile += "; " + value.machineName + "\n";
    makeFile += "projects[" + value.machineName + "][subdir] = \"" + contribSubdir + "\"\n";
    makeFile += "projects[" + value.machineName + "][version] = \"" + value.version.id.split('-')[1] + "\"\n\n";
  });


  // Theme stuff here
  makeFile += "; Themes\n\n";

  themes.forEach(function(value) {
    makeFile += "; " + value.machineName + "\n";
    if (value.type === 'drupal') {
    makeFile += "projects[" + value.machineName + "][version] = \"" + value.version.id.split('-')[1] + "\"\n\n";
    }
    else {
      makeFile += "projects[" + value.machineName + "][type] = \"" + value.projectType + "\"\n";
      makeFile += "projects[" + value.machineName + "][download][type] = \"" + value.type + "\"\n";
      makeFile += "projects[" + value.machineName + "][download][url] = \"" + value.url + "\"\n\n";
    }
  });


  // Libraries stuff here
  makeFile += "; Libraries\n\n";

  libraries.forEach(function(value) {
    makeFile += "; " + value.machineName + "\n";
    makeFile += "projects[" + value.machineName + "][type] = \"" + value.projectType + "\"\n";
    makeFile += "projects[" + value.machineName + "][download][type] = \"" + value.type + "\"\n";
    makeFile += "projects[" + value.machineName + "][download][url] = \"" + value.url + "\"\n\n";
  });


  res.send(makeFile);
};
