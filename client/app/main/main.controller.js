'use strict';

angular.module('drushmakeNodeApp')
  .controller('MainCtrl', function ($http) {
    var dashboard = this;

    dashboard.projects = [];
    dashboard.searchText = '';

    $http.get('/api/projects').success(function(projects) {
      angular.forEach(projects[0], function(data) {
        data.selected = false;
        dashboard.projects.push(data);
      });
    });

    dashboard.isSelected = function(item) {
      // console.log(item);
      return item.selected;
    };

    dashboard.sendData = function() {
      var results = [];
      angular.forEach(dashboard.projects, function(data) {
        if (data.selected) {
          results.push(data);
        }
      });
      if (results.length > 0) {
        $http.post('/api/projects', results).success(function (data) {
          //foreach para quitar todos los selecteds
          console.log('Exito!! ', data);
        }).error(function(err) {
          console.log('Mamón ',err);
        });
      }
    };

  });
