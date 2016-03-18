/**
 * Created by jonathan on 14/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.handlers.name)
    .factory(frontApp.modules.handlers.factories.notFound, function ($q, $location) {
      return {
        responseError: function(rejection) {
          if($location.url() != URLS.LOGIN() &&rejection.status === 404){
            $location.path(URLS.NOTFOUND());
          }
          return $q.reject(rejection);
        }
      };
    })
    .factory(frontApp.modules.handlers.factories.notAuthorized, function ($q, $location) {
      return {
        responseError: function(rejection) {
          if($location.url() != URLS.LOGIN() && rejection.status === 401){
            $location.path(URLS.NOTAUTHORIZED());
          }
          return $q.reject(rejection);
        }
      };
    })
    .factory(frontApp.modules.handlers.factories.serverError, function ($q, $location) {
      return {
        responseError: function(rejection) {
          if(rejection.status >= 500 && rejection.status <= 530){
            $location.path(URLS.SERVERERROR(rejection.status));
          }
          return $q.reject(rejection);
        }
      };
    });

}(angular, frontApp));
