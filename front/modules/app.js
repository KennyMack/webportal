'use strict';


(function (angular, frontApp) {
  'use strict';

  angular.module(frontApp.modules.app.name, [
    'ngMaterial',
    'ngMdIcons',
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    frontApp.modules.utils.name,
    frontApp.modules.auth.name,
    frontApp.modules.index.name,
    frontApp.modules.main.name,
    frontApp.modules.courses.name,
    frontApp.modules.students.name,
    frontApp.modules.teachers.name
  ])
    .constant('URLS', {
      BASE: 'http://portal.com/',
      BASE_API: 'http://portal.com/api/'
    })
    .config(function ($routeProvider) {
      $routeProvider.otherwise({
        redirectTo: '/'
      });
    })
    .run(['$rootScope', frontApp.modules.auth.factories.authentication, '$location',
      function ($rootScope, authentication, $location) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
          console.log('event');
          console.log(event);
          console.log('next');
          console.log(next);


          if (!authentication.isAuthenticated())
            $location.path('/login');
          else {
            authentication.credential(function (err) {
              if (err || status === 401) {
                authentication.logOut();
                $location.path('/login');
              }
            });
          }

        });
      }]);
}(angular, frontApp));

/*
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
      $rootScope.$on('$routeChangeStart', function (event, next) {
        console.log('event');
        console.log(event);
        console.log('next');
        console.log(next);


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
    }]);*/
