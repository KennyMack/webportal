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
      },
      users: {
        name: 'usersCtrl',
        nameas: 'users'
      }
    },
    factories:{
      authentication: 'authenticationFactory',
      authorization: 'authorizationFactory',
      users: 'usersFactory',
      authHeaders: 'authHeadersInterceptorFactory'
    },
    routes: {
      login: URLS.LOGIN(),
      personType: URLS.PERSONTYPE(),
      users: URLS.USERS()
    },
    templates: {
      login: {
        url: 'views/login.html'
      },
      personType: {
        url: 'views/personType.html'
      },
      users: {
        url: 'views/users.html'
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
