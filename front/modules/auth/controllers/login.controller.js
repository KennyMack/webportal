/**
 * Created by jonathan on 07/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.auth.name)
    .controller(frontApp.modules.auth.controllers.login.name, [
      frontApp.modules.auth.factories.authentication,
      frontApp.modules.auth.imports.localSave,
      frontApp.modules.auth.factories.users,
      'LOCALNAME',
      '$location',
      '$scope',
    function (authentication, localSave, users, LOCALNAME, $location, $scope) {
      var self = this;
      self.user = users.getUser();
      $scope.error = [];
      self.init = function () {
        /*authentication.credential(function (err, data, success, status) {
          console.log('crede');

          if (status === 200) {
            $location.path(URLS.HOME());
          }
          else if (status === 401) {
            $scope.error = [];
            users.clearUser();
            authentication.logOut();
          }
          else {
            $scope.error = [];
            users.clearUser();
            authentication.logOut();
            $location.path(URLS.SERVERERROR(status));
          }
        });*/
      };

      self.doLogin = function () {
        $scope.error = [];

        if (!self.user.username) {
          $scope.error.push('Informe o E-mail ou Usuário.');
        }

        if (!self.user.pass) {
          $scope.error.push('Senha é de preenchimento obrigatório.');
        }

        if ($scope.error.length <= 0) {
          authentication.authenticate(self.user.username, self.user.pass, function (err, data, success, status) {
            if (err){
              //$scope.error.push('Ocorreu um erro no aplicativo.');
              $location.path(URLS.SERVERERROR(status));
            }
            else if (!err && !success) {
              $scope.error = [];
              if ((data instanceof Object)) {
                angular.forEach(data.data, function (value) {
                  this.push(value);
                }, $scope.error);
              } else {
                $scope.error.push(data);
              }
            }
            else {
              authentication.setToken(data.token);
              self.user._id = data.user._id;
              self.user.email = data.user.email;
              self.user.username = data.user.username;
              self.user.pass = '';
              self.user.last_login = data.user.last_login;
              self.user.student_id = data.user.student_id;
              self.user.teachers_id = data.user.teachers_id;
              self.user.manager_id = data.user.manager_id;
              self.user.master_id = data.user.master_id;
              users.setUserLocal(self.user);
              localSave.setJSONValueLS(LOCALNAME.STUDENT_ID, self.user.student_id);
              localSave.setJSONValueLS(LOCALNAME.TEACHERS_ID, self.user.teachers_id);
              localSave.setJSONValueLS(LOCALNAME.MANAGER_ID, self.user.manager_id);
              localSave.setJSONValueLS(LOCALNAME.MASTER_ID, self.user.master_id);
              $location.path(URLS.PERSONTYPE());

            }
          });
        }
      };


      self.doLogOut = function () {
        $scope.error = [];
        users.clearUser();
        authentication.logOut();
        $location.path(URLS.LOGIN());
      };

    }]);

}(angular, frontApp));
