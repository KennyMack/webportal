/**
 * Created by jonathan on 17/03/16.
 */

/**
 * Created by jonathan on 10/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .factory(frontApp.modules.utils.factories.resource,
    function (BASEURLS, $resource, $window) {
      return {
        data: function (url) {
          return $resource(BASEURLS.BASE_API + url, {},
            {
              get: {
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': $window.localStorage.getItem('User-Token')
                }
              }
            }
          ).get({}).$promise;
        }
      }
    }
  );
}(angular, frontApp));
