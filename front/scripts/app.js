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
    'app.routes',
    'utils.localStorage',
    'utils.formsDirective',
    'utils.messages',
    'utils.requestFactory',
    'auth.authFactory',
    'app.usersFactory',
    'ngMaterial',
    'ngMdIcons',
    'ngAnimate',
    'ngResource',
    'ngSanitize'
  ])
  .constant('URLS', {
    BASE: 'http://portal.com/',
    BASE_API: 'http://portal.com/api/'
  })
.run(['$rootScope', 'authentication', '$location',
    function ($rootScope, authentication, $location) {
      $rootScope.$on('$routeChangeStart', function () {
        if (!authentication.isAuthenticated())
            $location.path('/login');
        else{
          authentication.credential(function (err) {
            if(err || status === 401) {
              authentication.logOut();
              $location.path('/login');
            }
          });
        }

      });
    }]);
