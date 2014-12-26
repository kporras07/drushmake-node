'use strict';

angular.module('drushmakeNodeApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'About',
      'link': '/about'
    },
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
