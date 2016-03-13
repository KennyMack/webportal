/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.auth = {
    name: 'auth',
    controllers: {
      login: {
        name: 'LoginCtrl',
        nameas: 'login'
      },
      personType: {
        name: 'personTypeCtrl',
        nameas: 'person'
      }
    },
    factories:{
      authentication: 'authenticationFactory',
      users: 'usersFactory'
    },
    routes: {
      login: '/login',
      personType: '/person-type'
    },
    templates: {
      login: {
        url: 'views/login.html'
      },
      personType: {
        url: 'views/personType.html'
      }
    },
    imports: {
      localSave: frontApp.modules.utils.services.localSave,
      messages: frontApp.modules.utils.services.messages,
      request: frontApp.modules.utils.factories.request
    }
  };

  angular.module(frontApp.modules.auth.name, [
    'ngRoute',
    frontApp.modules.utils.name
  ]);
}(angular, frontApp));
