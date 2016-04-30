
/**
 * Created by jonathan on 11/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.auth.name)
    .factory(frontApp.modules.auth.factories.authentication, [
      'LOCALNAME',
      frontApp.modules.auth.imports.request,
      frontApp.modules.auth.imports.localSave,
    function (LOCALNAME, request, localSave) {
      return {
        authenticate: function (usr, pass, callback) {
          var user = {
            username: usr,
            password: pass
          };
          request.post(URLS.MORDOR.AUTHENTICATE(), user)
            .then(function (data) {
              callback(data.err, data.data, data.success, data.status);
            })
            .catch(function(err){
              callback(err.err, err.data, err.success, err.status);
            });
        },
        setToken: function (value) {
          localSave.setValueLS(LOCALNAME.USER_TOKEN, value);
        },
        credential: function (callback) {
          request.get(URLS.MORDOR.CREDENTIAL())
            .then(function (data) {
              callback(data.err, data.data, data.success, data.status);
            })
            .catch(function (err) {
              callback(err.err, err.data, false, err.status);
            })
        },
        logOut: function () {
          localSave.removeValueLS(LOCALNAME.USER_TOKEN);
          localSave.removeValueLS(LOCALNAME.SESSION_USER);
          localSave.removeValueLS(LOCALNAME.PERSON_ID);
          localSave.removeValueLS(LOCALNAME.STUDENT_ID);
          localSave.removeValueLS(LOCALNAME.TEACHERS_ID);
          localSave.removeValueLS(LOCALNAME.MANAGER_ID);
          localSave.removeValueLS(LOCALNAME.MASTER_ID);
        },
        isAuthenticated: function () {
          var tok = localSave.getValueLS(LOCALNAME.USER_TOKEN);
          return tok != null;
        }
      };
    }])
    .factory(frontApp.modules.auth.factories.authorization, [
      'LOCALNAME',
      frontApp.modules.auth.imports.localSave,
      frontApp.modules.auth.factories.authentication,
      function (LOCALNAME, localSave, authentication) {
        return {
          authorize: function (next, callback) {
            var authorized = false;

            if (next.access != undefined) {
              var type = localSave.getJSONValueLS(LOCALNAME.PERSON_ID);
              if (type != null && next.access.requiresLogin && next.access.requiredPermissions !== undefined) {
                for (var i = 0, length = next.access.requiredPermissions.length; i < length; i++) {
                  if (type.type == next.access.requiredPermissions[i]) {
                    authorized = true;
                    break;
                  }
                }
              }
              else
                authorized = true;
            }
            else {
              authorized = true;
            }

            if (!authorized) {
              callback(false, URLS.NOTAUTHORIZED());
            }
            else {
              if (!authentication.isAuthenticated()){
                authentication.logOut();
                callback(false, URLS.LOGIN());
              }
              else {
                authentication.credential(function (err) {
                  if (err || status === 401) {
                    authentication.logOut();
                    authorized = false;
                  }
                  callback(authorized, URLS.LOGIN());
                });
              }
            }
          }
        }
      }

    ]);


    /*TODO: Verificar utilidade
    .factory('authInterceptor', function(localSave) {
      return {
        request: function (config) {
          var token = localSave.getValueLS('User-Token');
          if (token) {
            config.headers['x-access-token'] = token;
          }
          return config;
        }
      }
    });*/
}(angular, frontApp));
