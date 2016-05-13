/**
 * Created by jonathan on 01/05/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .factory(frontApp.modules.teachers.factories.teachers, [
      frontApp.modules.teachers.imports.localSave,
      'LOCALNAME',
      'BASEURLS',
      '$resource',
      function (localSave, LOCALNAME, BASEURLS, $resource) {
        var Headers = {
          'Content-Type': 'application/json',
          'x-access-token': localSave.getValueLS(LOCALNAME.USER_TOKEN)
        };
        return{
          getTeachers: function () {
            return $resource(BASEURLS.BASE_API + URLS.TEACHERS(), {},
              {
                get: {
                  headers: Headers
                }
              }
            ).get({}).$promise;
          },
          getTeacher: function (id) {
            return $resource(BASEURLS.BASE_API + URLS.TEACHERS(id), {},
              {
                get: {
                  headers: Headers
                }
              }
            ).get({}).$promise;
          },
          Teacher: function () {
            return $resource(BASEURLS.BASE_API + URLS.TEACHERS(':Id'), {Id:'@id'},
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
