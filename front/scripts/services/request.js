
/**
 * Created by jonathan on 10/03/16.
 */
(function() {
  'use strict';
  angular.module('utils.requestFactory', ['utils.localStorage'])
    .factory('request', [
      'URLS',
      '$http',
      'localSave',
      function (URLS, $http, localSave) {
        return {
          get: function (url, data, callback) {
            var uri = URLS.BASE_API + url;
            $http({
              method: 'GET',
              url: uri,
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': localSave.getValueLS('User-Token')
              }
            }).success(function (data, status) {
              callback(false, data, status);
            }).error(function (data, status) {
              callback(true, data, status);
            });
          },
          post: function (url, data, callback) {
            var uri = URLS.BASE_API + url;
            $http({
              method: 'POST',
              url: uri,
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': localSave.getValueLS('User-Token')
              },
              data: data
            }).success(function (data, status) {
              callback(false, data, status);
            }).error(function (data, status) {
              callback(true, data, status);
            });
          },
          put: function (url, data, callback) {
            var uri = URLS.BASE_API + url;
            $http({
              method: 'PUT',
              url: uri,
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': localSave.getValueLS('User-Token')
              },
              data: data
            }).success(function (data, status) {
              callback(false, data, status);
            }).error(function (data, status) {
              callback(true, data, status);
            });
          },
          delete: function (url, data, callback) {
            var uri = URLS.BASE_API + url;
            $http({
              method: 'DELETE',
              url: uri,
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': localSave.getValueLS('User-Token')
              }
            }).success(function (data, status) {
              callback(false, data, status);
            }).error(function (data, status) {
              callback(true, data, status);
            });
          }
        }
      }
    ]);
})();
