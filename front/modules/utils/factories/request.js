
/**
 * Created by jonathan on 10/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .factory(frontApp.modules.utils.factories.request,
      function (BASEURLS, $http, $window) {
        return {
          get: function (url, callback) {
            var uri = BASEURLS.BASE_API + url;
            $http({
              method: 'GET',
              url: uri,
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': $window.localStorage.getItem('User-Token')
              }
            }).success(function (data, status) {
              callback(false, data, status);
            }).error(function (data, status) {
              callback(true, data, status);
            });
          },
          post: function (url, data, callback) {
            var uri = BASEURLS.BASE_API + url;
            $http({
              method: 'POST',
              url: uri,
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': $window.localStorage.getItem('User-Token')
              },
              data: data
            }).success(function (data, status) {
              callback(false, data, status);
            }).error(function (data, status) {
              callback(true, data, status);
            });
          },
          put: function (url, data, callback) {
            var uri = BASEURLS.BASE_API + url;
            $http({
              method: 'PUT',
              url: uri,
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': $window.localStorage.getItem('User-Token')
              },
              data: data
            }).success(function (data, status) {
              callback(false, data, status);
            }).error(function (data, status) {
              callback(true, data, status);
            });
          },
          delete: function (url, callback) {
            var uri = BASEURLS.BASE_API + url;
            $http({
              method: 'DELETE',
              url: uri,
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': $window.localStorage.getItem('User-Token')
              }
            }).success(function (data, status) {
              callback(false, data, status);
            }).error(function (data, status) {
              callback(true, data, status);
            });
          }
        }
      }
    );
}(angular, frontApp));
