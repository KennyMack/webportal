/**
 * Created by jonathan on 17/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.auth.name)
    .factory(frontApp.modules.auth.factories.authHeaders, function () {
      return {
        getHeaders: function(config, $window) {
          config.headers["Content-Type"] = 'application/json';
          config.headers["x-access-token"] = $window.localStorage.getItem('User-Token');

          return config;
        }
      };
    })
}(angular, frontApp));
