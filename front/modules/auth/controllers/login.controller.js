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
      var vm = this;
      vm.user = users.getUser();

      vm.init = function () {
        authentication.credential(function (err, data, status) {
          if (!err && status !== 401) {
            $location.path(URLS.HOME());
          }
          else {
            $scope.error = [];
            users.clearUser();
            authentication.logOut();
          }
        });
      };

      vm.doLogin = function () {
        $scope.error = [];

        if (!vm.user.username) {
          $scope.error.push('Informe o E-mail ou Usuário.');
        }

        if (!vm.user.pass) {
          $scope.error.push('Senha é de preenchimento obrigatório.');
        }

        if ($scope.error.length <= 0) {
          authentication.authenticate(vm.user.username, vm.user.pass, function (err, data) {
            if (err || !data.success) {
              $scope.error = [];
              if ((data.data instanceof Object)) {
                angular.forEach(data.data, function (value) {
                  this.push(value);
                }, $scope.error);
              } else {
                $scope.error.push(data.data || 'Ocorreu um erro no aplicativo.');
              }
            }
            else {
              authentication.setToken(data.token);
              vm.user._id = data.user._id;
              vm.user.email = data.user.email;
              vm.user.username = data.user.username;
              vm.user.pass = '';
              vm.user.last_login = data.user.last_login;
              vm.user.student_id = data.user.student_id;
              vm.user.teachers_id = data.user.teachers_id;
              vm.user.manager_id = data.user.manager_id;
              vm.user.master_id = data.user.master_id;
              users.setUserLocal(vm.user);
              localSave.setJSONValueLS(LOCALNAME.STUDENT_ID, vm.user.student_id);
              localSave.setJSONValueLS(LOCALNAME.TEACHERS_ID, vm.user.teachers_id);
              localSave.setJSONValueLS(LOCALNAME.MANAGER_ID, vm.user.manager_id);
              localSave.setJSONValueLS(LOCALNAME.MASTER_ID, vm.user.master_id);
              $location.path(URLS.PERSONTYPE());
            }
          });
        }
      };
      $scope.error = [];

      vm.doLogOut = function () {
        $scope.error = [];
        users.clearUser();
        authentication.logOut();
        $location.path(URLS.LOGIN());
      };

    }]);

}(angular, frontApp));
