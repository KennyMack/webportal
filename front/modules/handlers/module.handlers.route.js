/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.handlers.name)
    .config(
    function ($routeProvider) {
      $routeProvider
        .when(frontApp.modules.handlers.routes.notAuthorized, {
          controller: frontApp.modules.handlers.controllers.notAuthorized.name,
          controllerAs: frontApp.modules.handlers.controllers.notAuthorized.nameas,
          templateUrl: frontApp.modules.handlers.templates.notAuthorized.url,
          access: {
            requiresLogin: false

          }
        })
        .when(frontApp.modules.handlers.routes.notFound, {
          controller: frontApp.modules.handlers.controllers.notFound.name,
          controllerAs: frontApp.modules.handlers.controllers.notFound.nameas,
          templateUrl: frontApp.modules.handlers.templates.notFound.url,
          access: {
            requiresLogin: false

          }
        })
      .when(frontApp.modules.handlers.routes.serverError, {
        controller: frontApp.modules.handlers.controllers.serverError.name,
        controllerAs: frontApp.modules.handlers.controllers.serverError.nameas,
        templateUrl: frontApp.modules.handlers.templates.serverError.url,
          access: {
            requiresLogin: false
          }
      });
    });
}(angular, frontApp));
