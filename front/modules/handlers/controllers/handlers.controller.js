/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.handlers.name)
    .controller(frontApp.modules.handlers.controllers.notAuthorized.name, [
      '$location',
      function ($location) {
        var vm = this;
        vm.goBack = function () {
          $location.path('/')
        }
      }
    ])
    .controller(frontApp.modules.handlers.controllers.notFound.name, [
      '$location',
      function ($location) {
        var vm = this;
        vm.goBack = function () {
          $location.path('/')
        }
      }
    ])
    .controller(frontApp.modules.handlers.controllers.serverError.name, [
      '$location',
      '$routeParams',
      function ($location, $routeParams) {
        var vm = this;
        vm.errorCode = $routeParams.errorCode;
        vm.goBack = function () {
          $location.path('/')
        }
      }
    ]);

}(angular, frontApp));
