/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .config(
    function ($routeProvider) {
      $routeProvider
        .when(frontApp.modules.courses.routes.courses, {
          controller:  frontApp.modules.courses.controllers.courses.name,
          controllerAs:  frontApp.modules.courses.controllers.courses.nameas,
          templateUrl: frontApp.modules.courses.templates.courses.url
        })
    });

}(angular, frontApp));
