/**
 * Created by jonathan on 17/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .factory(frontApp.modules.courses.factories.courses, [
      frontApp.modules.utils.services.localSave,
      'LOCALNAME',
      'BASEURLS',
      '$resource',
    function (localSave, LOCALNAME, BASEURLS, $resource) {
      var Headers = {
        'Content-Type': 'application/json',
        'x-access-token': localSave.getValueLS(LOCALNAME.USER_TOKEN)
      };

      return{
        getCourses: function () {
          return $resource(BASEURLS.BASE_API + URLS.COURSES(), {},
            {
              get: {
                headers: Headers
              }
            }
          ).get({}).$promise;
        },
        getCourse: function (id) {
          return $resource(BASEURLS.BASE_API + URLS.COURSES(id), {},
            {
              get: {
                headers: Headers
              }
            }
          ).get({}).$promise;
        },
        Course: function () {
          return $resource(BASEURLS.BASE_API + URLS.COURSES(':Id'), {Id:'@id'},
            {
              post: {
                method: "POST",
                headers: Headers
              },
              put: {
                method: "PUT",
                headers: Headers
              },
              get: {
                method: "GET",
                headers: Headers
              }
            }
          );
        }
      }

    }
  ]);
}(angular, frontApp));
