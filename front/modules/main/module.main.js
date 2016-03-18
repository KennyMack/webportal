/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.main = {
    name: 'main',
    controllers: {
      main: {
        name: 'MainCtrl',
        nameas: 'main'
      }
    },
    routes: {
      main: URLS.HOME()
    },
    templates: {
      main: {
        url: 'views/main.html'
      }
    }
  };
  angular.module(frontApp.modules.main.name, [
    'ngRoute'
  ]);

}(angular, frontApp));
