/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.main.name)
    .config(
    function ($routeProvider) {
      $routeProvider
        .when(frontApp.modules.main.routes.main, {
          controller:  frontApp.modules.main.controllers.main.name,
          controllerAs:  frontApp.modules.main.controllers.main.nameas,
          templateUrl: frontApp.modules.main.templates.main.url
        })
    });

}(angular, frontApp));
