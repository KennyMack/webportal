/**
 * Created by jonathan on 17/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .factory(frontApp.modules.courses.factories.courses, [
      frontApp.modules.utils.services.localSave,
      'LOCALNAME',
      'BASEURLS',
      '$resource',
    function (localSave, LOCALNAME, BASEURLS, $resource) {
      return{
        getCourses: function () {
          return $resource(BASEURLS.BASE_API + URLS.COURSES(), {},
            {
              get: {
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': localSave.getValueLS(LOCALNAME.USER_TOKEN)
                }
              }
            }
          ).get({}).$promise;
        },
        getCourse: function (id) {
          return $resource(BASEURLS.BASE_API + URLS.COURSES(id), {},
            {
              get: {
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': localSave.getValueLS(LOCALNAME.USER_TOKEN)
                }
              }
            }
          ).get({}).$promise;
        },
        Course: function () {
          return $resource(BASEURLS.BASE_API + URLS.COURSES(':Id'), {Id:'@id'},
            {
              post: {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': localSave.getValueLS(LOCALNAME.USER_TOKEN)
                }
              },
              put: {
                method: "PUT",
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': localSave.getValueLS(LOCALNAME.USER_TOKEN)
                }
              },
              get: {
                method: "GET",
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': localSave.getValueLS(LOCALNAME.USER_TOKEN)
                }
              }
            }
          );
        }
      }

    }
  ]);
}(angular, frontApp));
