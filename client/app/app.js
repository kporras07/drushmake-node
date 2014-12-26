'use strict';

angular.module('drushmakeNodeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ngClipboard'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
