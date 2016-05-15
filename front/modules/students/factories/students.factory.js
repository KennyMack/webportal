/**
 * Created by jonathan on 17/04/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .factory(frontApp.modules.students.factories.students, [
      frontApp.modules.students.imports.localSave,
      'LOCALNAME',
      'BASEURLS',
      '$resource',
      function (localSave, LOCALNAME, BASEURLS, $resource) {
        var Headers = {
          'Content-Type': 'application/json',
          'x-access-token': localSave.getValueLS(LOCALNAME.USER_TOKEN)
        };
        return{
          getStudents: function () {
            return $resource(BASEURLS.BASE_API + URLS.STUDENTS(), {},
              {
                get: {
                  headers: Headers
                }
              }
            ).get({}).$promise;
          },
          getStudent: function (id) {
            return $resource(BASEURLS.BASE_API + URLS.STUDENTS(id), {},
              {
                get: {
                  headers: Headers
                }
              }
            ).get({}).$promise;
          },
          Student: function () {
            return $resource(BASEURLS.BASE_API + URLS.STUDENTS(':Id'), {Id:'@id'},
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
