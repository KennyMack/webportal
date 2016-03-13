/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.teachers.name)
    .config(
    function ($routeProvider) {
      $routeProvider
        .when(frontApp.modules.teachers.routes.teachers, {
          controller:  frontApp.modules.teachers.controllers.teachers.name,
          controllerAs:  frontApp.modules.teachers.controllers.teachers.nameas,
          templateUrl: frontApp.modules.teachers.templates.teachers.url
        })
    });

}(angular, frontApp));
