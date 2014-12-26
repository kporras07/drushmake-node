'use strict';

angular.module('drushmakeNodeApp')
  .controller('MainCtrl', function ($http) {
    var dashboard = this;

    dashboard.projects = [];
    dashboard.projectTypes = [
      {
        projectType: 'module',
        projectTypeName: 'Modules'
      },
      {
        projectType: 'theme',
        projectTypeName: 'Themes'
      },
      {
        projectType: 'library',
        projectTypeName: 'Libraries'
      }
    ];

    dashboard.searchText = '';
    dashboard.makeResult = '';
    dashboard.newThemeType = 'drupal';
    dashboard.newLibraryType = 'www';
    dashboard.drupalVersion = 7;
    dashboard.contribSubdir = '';

    $http.get('/api/projects').success(function(projects) {
      angular.forEach(projects[0], function(data) {
        data.selected = false;
        data.version = '';
        data.versions = [];
        dashboard.projects.push(data);
      });
    });

    dashboard.resetAll = function() {
      dashboard.projects = [];
      dashboard.makeResult = '';
      dashboard.newThemeType = 'drupal';
      dashboard.newLibraryType = 'www';
      $http.get('/api/projects').success(function(projects) {
        angular.forEach(projects[0], function(data) {
          data.selected = false;
          data.version = '';
          data.versions = [];
          dashboard.projects.push(data);
        });
      });
    };

    dashboard.isSelected = function(item) {
      return item.selected;
    };

    dashboard.sendData = function() {
      var results = [];
      angular.forEach(dashboard.projects, function(data) {
        if (data.selected) {
          results.push(data);
        }
      });
      var options = {
        drupalVersion: dashboard.drupalVersion,
        contribSubdir: dashboard.contribSubdir
      };

      if (results.length > 0) {
        var postData = {
          projects: results,
          options: options
        };
        $http.post('/api/projects', postData).success(function (data) {
          dashboard.makeResult = data;
        }).error(function(err) {
          console.log('Error',err);
        });
      }
    };

    dashboard.getTextToCopy = function() {
      return dashboard.makeResult;
    }

    dashboard.addProject = function(type) {
      switch (type) {
        case 'module':
          var projectName = dashboard.newModule;
          $http.get('api/projects/name/' + projectName).success(function(data) {
            if (data) {
              var exists = false;
              angular.forEach(dashboard.projects, function(data) {
                if (!exists) {
                  if (data.machineName === projectName) {
                    exists = true;
                    data.selected = true;
                  }
                }
              });
              if (!exists) {

                var url = 'api/projects/versions/' + dashboard.drupalVersion + '/' + projectName;
                $http.get(url).success(function(versions) {
                  if (versions) {
                    dashboard.projects.push({
                      projectType: 'module',
                      type: 'drupal',
                      machineName: projectName,
                      humanName: data,
                      selected: true,
                      versions: versions,
                      version: versions[0],
                    });
                    dashboard.newModule = '';
                  }
                  else {
                    console.log("Couldn't find versions for this project.");
                  }
                }).error(function(err) {
                  console.log(err, 'Error');
                });
              }
          }
          else {
            console.log("Module doesn't exist.");
          }
      }).error(function(err) {
        console.log(err, 'Error');
      });
          break;
        case 'theme':
          var projectName = dashboard.newTheme;
          var type = dashboard.newThemeType;
          if (type === 'drupal') {
            $http.get('api/projects/name/' + projectName).success(function(data) {
              if (data) {
                var exists = false;
                angular.forEach(dashboard.projects, function(data) {
                  if (!exists) {
                    if (data.machineName === projectName) {
                      exists = true;
                      data.selected = true;
                    }
                  }
                });
                if (!exists) {

                  var url = 'api/projects/versions/' + dashboard.drupalVersion + '/' + projectName;
                  $http.get(url).success(function(versions) {
                    if (versions) {
                      dashboard.projects.push({
                        projectType: 'theme',
                        type: type,
                        machineName: projectName,
                        humanName: data,
                        selected: true,
                        versions: versions,
                        version: versions[0],
                      });
                      dashboard.newTheme = '';
                    }
                    else {
                      console.log("Couldn't find versions for this project.");
                    }
                  }).error(function(err) {
                    console.log(err, 'Error');
                  });
                }
              }
              else {
                console.log("Theme doesn't exist.");
              }
            }).error(function(err) {
              console.log(err, 'Error');
            });
          }
          else {
            // Type not Drupal.
            var exists = false;
            angular.forEach(dashboard.projects, function(data) {
              if (!exists) {
                if (data.machineName === projectName) {
                  exists = true;
                  data.selected = true;
                }
              }
            });
            if (!exists) {
              dashboard.projects.push({
                projectType: 'theme',
                type: type,
                machineName: projectName,
                humanName: projectName,
                selected: true,
                url: dashboard.newThemeUrl,
                version: {id: 'na'}
              });
              dashboard.newTheme = '';
              dashboard.newThemeUrl = '';
            }
          }
          break;
        case 'library':
          var projectName = dashboard.newLibrary;
          var type = dashboard.newLibraryType;
          var exists = false;
          angular.forEach(dashboard.projects, function(data) {
            if (!exists) {
              if (data.machineName === projectName) {
                exists = true;
                data.selected = true;
              }
            }
          });
          if (!exists) {
            dashboard.projects.push({
              projectType: 'library',
              type: type,
              machineName: projectName,
              humanName: projectName,
              selected: true,
              url: dashboard.newLibraryUrl,
              version: {id: 'na'}
            });
            dashboard.newLibrary = '';
            dashboard.newLibraryUrl = '';
          }
          break;
      }
    };

    dashboard.populateVersions = function(project) {
      if (project.selected) {
        var url = 'api/projects/versions/' + dashboard.drupalVersion + '/' + project.machineName;
        $http.get(url).success(function(data) {
          if (data) {
            project.versions = data;
            project.version = data[0];
          }
          else {
            console.log("Couldn't find versions for this project.");
          }
        }).error(function(err) {
          console.log(err, 'Error');
        });
      }
    };

  });
