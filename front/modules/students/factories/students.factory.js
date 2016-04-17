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
        return{
          getStudents: function () {
            return $resource(BASEURLS.BASE_API + URLS.STUDENTS(), {},
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
          getStudent: function (id) {
            return $resource(BASEURLS.BASE_API + URLS.STUDENTS(id), {},
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
          Student: function () {
            return $resource(BASEURLS.BASE_API + URLS.STUDENTS(':Id'), {Id:'@id'},
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
