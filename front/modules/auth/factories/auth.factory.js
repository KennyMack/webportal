
/**
 * Created by jonathan on 11/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  console.log('frontApp');
  console.log(frontApp);
  angular.module(frontApp.modules.auth.name)
    .factory(frontApp.modules.auth.factories.authentication, [
      frontApp.modules.auth.imports.request,
      frontApp.modules.auth.imports.localSave,
    function (request, localSave) {
      return {
        authenticate: function (usr, pass, callback) {
          var user = {
            username: usr,
            password: pass
          };
          request.post('mordor/authenticate', user, function (err, data) {
            callback(err, data);
          });
        },
        setToken: function (value) {
          localSave.setValueLS('User-Token', value);
        },
        credential: function (callback) {
          request.get('mordor/credential', {}, function (err, data, status) {
            callback(err, data, status);
          })
        },
        logOut: function () {
          localSave.removeValueLS('User-Token');
          localSave.removeValueLS('Session-User');
          localSave.removeValueLS('PERSON-ID');
          localSave.removeValueLS('STUDENT-ID');
          localSave.removeValueLS('TEACHERS-ID');
          localSave.removeValueLS('MANAGER-ID');
          localSave.removeValueLS('MASTER-ID');
        },
        isAuthenticated: function () {
          var tok = localSave.getValueLS('User-Token');
          return tok != null;
        }
      };
    }]);
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
