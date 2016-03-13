/**
 * Created by jonathan on 11/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.auth.name)
    .factory(frontApp.modules.auth.factories.users,[
      frontApp.modules.auth.imports.localSave,
      frontApp.modules.auth.imports.request,
    function (localSave, request) {
      var uri = 'users/';
      var user = {
        _id: '',
        email: '',
        username: '',
        pass: '',
        last_login: '',
        student_id: '',
        teachers_id: '',
        manager_id: '',
        master_id: ''
      };

      return {
        getUser: function () {
          return user;
        },
        clearUser: function () {
          user._id = '';
          user.email = '';
          user.username = '';
          user.pass = '';
          user.last_login = '';
          user.student_id = '';
          user.teachers_id = '';
          user.manager_id = '';
          user.master_id = ''
        },
        setUserLocal: function (usr) {
          localSave.setJSONValueLS('Session-User', usr);

        },
        getUserView: function (_id) {
          request.get(uri + '/view/' + _id, {}, function (err, data, status) {
            if (!err && status === 200 && data.success) {

            }
          });
        }
      };
    }])

}(angular, frontApp));
