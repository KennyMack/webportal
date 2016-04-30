
/**
 * Created by jonathan on 10/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .factory(frontApp.modules.utils.factories.request,
      function (BASEURLS, $http, $window, $q) {
        var Header = {
          'Content-Type': 'application/json',
          'x-access-token': $window.localStorage.getItem('User-Token')
        };

        return {
          get: function (url) {
            var q = $q.defer();
            var uri = BASEURLS.BASE_API + url;
            $http({
              method: 'GET',
              url: uri,
              headers: Header
            }).success(function (data, status) {
               q.resolve({ err: false, data: data, status: status });
            }).error(function (data, status) {
              q.reject({ err: true, data: data, status: status });
            });

            return q.promise;
          },
          post: function (url, data) {
            var q = $q.defer();
            var uri = BASEURLS.BASE_API + url;
            $http({
              method: 'POST',
              url: uri,
              headers: Header,
              data: data
            }).success(function (data, status) {
              q.resolve({ err: false, data: data, status: status });
            }).error(function (data, status) {
              q.reject({ err: true, data: data, status: status });
            });
            return q.promise;
          },
          put: function (url, data) {
            var uri = BASEURLS.BASE_API + url;
            $http({
              method: 'PUT',
              url: uri,
              headers: Header,
              data: data
            }).success(function (data, status) {
              q.resolve({ err: false, data: data, status: status });
            }).error(function (data, status) {
              q.reject({ err: true, data: data, status: status });
            });
            return q.promise;
          },
          delete: function (url) {
            var q = $q.defer();
            var uri = BASEURLS.BASE_API + url;
            $http({
              method: 'DELETE',
              url: uri,
              headers: Header
            }).success(function (data, status) {
              q.resolve({ err: false, data: data, status: status });
            }).error(function (data, status) {
              q.reject({ err: true, data: data, status: status });
            });
            return q.promise;
          }
        }
      }
    );
}(angular, frontApp));
