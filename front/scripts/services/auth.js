
/**
 * Created by jonathan on 11/03/16.
 */
(function() {
  'use strict';
  angular.module('auth.authFactory', ['utils.requestFactory', 'utils.localStorage'])
    .factory('authentication', ['request', 'localSave', function (request, localSave) {
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
    }])
    .factory('authInterceptor', ['localSave', function(localSave) {
      return {
        request: function (config) {
          var token = localSave.getValueLS('User-Token');
          if (token) {
            config.headers['x-access-token'] = token;
          }
          return config;
        }
      }
    }]);
})();
