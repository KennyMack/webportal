/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.index = {
    name: 'index',
    controllers: {
      index: {
        name: 'IndexCtrl',
        nameas: 'index'
      },
      routes: {
        index: '/'
      }
    },
    imports: {
      users: frontApp.modules.auth.factories.users,
      authentication: frontApp.modules.auth.factories.authentication,
      localSave: frontApp.modules.utils.services.localSave
    }
  };
  angular.module(frontApp.modules.index.name, [
    'ngRoute',
    frontApp.modules.utils.name,
    frontApp.modules.auth.name
  ])/*.config(function ($routeProvider) {
    $routeProvider.when(frontApp.modules.index.routes.index, {
      controller: frontApp.modules.index.controllers.index.name,
      controllerAs: frontApp.modules.index.controllers.index.nameas
    });
  })*/;

  /*'modules.auth.factories.authFactory',
    'modules.utils.services.localStorage',
    'modules.app.factories.usersFactory'*/

}(angular, frontApp));

