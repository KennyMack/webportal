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
    frontApp.modules.handlers.name,
    frontApp.modules.auth.name,
    frontApp.modules.index.name,
    frontApp.modules.main.name,
    frontApp.modules.courses.name,
    frontApp.modules.students.name,
    frontApp.modules.teachers.name
  ])
    .constant('BASEURLS', {
      BASE: 'http://portal.com',
      BASE_API: 'http://portal.com/api'
    })
    .constant('LOCALNAME', {
      MANAGER_ID: 'MANAGER-ID',
      MASTER_ID: 'MASTER-ID',
      PERSON_ID: 'PERSON-ID',
      STUDENT_ID: 'STUDENT-ID',
      SESSION_USER: 'Session-User',
      TEACHERS_ID: 'TEACHERS-ID',
      USER_TOKEN: 'User-Token'
    })
    .config(function ($routeProvider, $httpProvider, $mdDateLocaleProvider) {
      $mdDateLocaleProvider.formatDate = function(date) {
        return date ? moment(date).format('DD/MM/YYYY') : '';
      };

      $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };

      $httpProvider.interceptors.push(
        frontApp.modules.auth.factories.authHeaders
      );
      //TODO: Remover ao finalizar os teste
      //$httpProvider.interceptors.push(
      //  frontApp.modules.handlers.factories.notFound);
      //$httpProvider.interceptors.push(
      //  frontApp.modules.handlers.factories.notAuthorized);
      $httpProvider.interceptors.push(
          frontApp.modules.handlers.factories.serverError);

      $routeProvider.otherwise({
        redirectTo: URLS.NOTFOUND()
      });
    })
    .run([
      frontApp.modules.auth.factories.authentication,
      frontApp.modules.auth.factories.authorization,
      frontApp.modules.main.factories.principalButtonFactory,
      '$rootScope',
      '$location',
      function (authentication, authorization, principalButtonFactory, $rootScope, $location) {

        $rootScope.$on('$routeChangeStart', function (event, next) {
          $rootScope.__showButton = principalButtonFactory.showButton(next);

        });

        $rootScope.$on('$routeChangeSuccess', function (event, next) {
          authorization.authorize(next)
            .then(function (url) {

            })
            .catch(function (url) {
              $location.path(url);
            });
        });

        $rootScope.$on('$viewContentLoaded', function(){

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
