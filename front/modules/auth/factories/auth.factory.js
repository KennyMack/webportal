
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
          authorize: function (next) {
            return new Promise(function (resolve, reject) {
              var sessionUser = localSave.getJSONValueLS(LOCALNAME.SESSION_USER);
              var personType = localSave.getJSONValueLS(LOCALNAME.PERSON_ID);

              if (next.originalPath === '/person-type' &&
                sessionUser != null &&
                personType  == null) {
                resolve('');
              }
              else if (sessionUser  != null &&
                personType == null){
                reject(URLS.PERSONTYPE());

              }
              else {

                var authorized = false;
                var requiresLogin = true;

                if (next.access != undefined) {


                  if (next.access.hasOwnProperty('requiresLogin')) {
                    requiresLogin = next.access.requiresLogin;
                  }

                  if (personType != null &&
                    requiresLogin &&
                    next.access.requiredPermissions !== undefined) {

                    var found = 0;
                    var nPermiss = next.access.requiredPermissions.length;

                    for (var i = 0; i < nPermiss; i++) {
                      if (personType.type === next.access.requiredPermissions[i])
                        found++;
                    }

                    if (nPermiss > 0 &&
                      found > 0) {
                      authorized = true;
                    }
                    else if (nPermiss === 0) {
                      authorized = true;
                    }
                  }
                  else
                    authorized = true;
                }
                else {
                  requiresLogin = true;
                  authorized = true;
                }

                if (!authorized && requiresLogin) {
                  if (personType != null)
                    reject(URLS.NOTAUTHORIZED());
                  else
                    reject(URLS.LOGIN());
                }
                else if (requiresLogin) {
                  if (!authentication.isAuthenticated()) {
                    authentication.logOut();
                    reject(URLS.LOGIN());
                  }
                  else {
                    authentication.credential(function (err, data, success, status) {
                      if (status === 200) {
                        resolve('');
                      }
                      else if (status === 401) {
                        authentication.logOut();
                        reject(URLS.LOGIN());
                      }
                      else {
                        reject(URLS.SERVERERROR(status));
                      }

                    });
                  }
                }
                else
                  resolve('');
              }
            });

          }
        }
      }
    ]);
}(angular, frontApp));
