/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.auth.name)
    .config(
    function ($routeProvider) {
      $routeProvider
        .when(frontApp.modules.auth.routes.login, {
          controller:  frontApp.modules.auth.controllers.login.name,
          controllerAs:  frontApp.modules.auth.controllers.login.nameas,
          templateUrl: frontApp.modules.auth.templates.login.url
        })
        .when(frontApp.modules.auth.routes.personType, {
          controller: frontApp.modules.auth.controllers.personType.name,
          controllerAs: frontApp.modules.auth.controllers.personType.nameas,
          templateUrl: frontApp.modules.auth.templates.personType.url
        });
    });

}(angular, frontApp));
