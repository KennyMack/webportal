'use strict';

/**
 * @ngdoc overview
 * @name frontApp
 * @description
 * # frontApp
 *
 * Main module of the application.
 */
angular
  .module('frontApp', [
    'ngMaterial',
    'ngMdIcons',
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
.run(['$rootScope', '$http', '$location',
    function ($rootScope, $http, $location) {
      /*$http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrf-Token');
      $http.defaults.headers.post['x-access-token'] = $cookies.get('User-Token');
      $rootScope.$on('$locationChangeStart', function (event) {
        Auth.isLoggedIn(function (ok) {
          $rootScope.IS_LOGGED = ok;
          if (!ok)
            $location.path('/login');
        });
      });*/
    }]);
