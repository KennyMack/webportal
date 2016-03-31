/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
angular.module(frontApp.modules.index.name)
  .controller(frontApp.modules.index.controllers.index.name, [
    'LOCALNAME',
    frontApp.modules.index.imports.authentication,
    frontApp.modules.index.imports.localSave,
    frontApp.modules.index.imports.users,
    '$scope', '$timeout', '$mdSidenav',
    '$log', '$location',
    function (LOCALNAME,
              authentication, localSave, users,
              $scope, $timeout, $mdSidenav,
              $log, $location) {
      var vm = this;
      vm.showButton = true;
      vm.mainMenu = [];
      vm.user = users.getUser();
      vm.person = {};
      vm.toggleLeft = buildDelayedToggler('left');
      vm.toggleRight = buildToggler('right');
      vm.isOpen = true;
      vm.selectedMode = 'md-fling';
      vm.imagePath = '../images/android.svg';

      vm.actionMenu = function (action) {
        $scope.$broadcast('actionMenu::'+action);
      };

      $scope.$on('actionMenu::SHOWBUTTON', function() {
        vm.showButton = true;
        console.log('actionMenu::SHOWBUTTON');
      });

      $scope.$on('actionMenu::HIDEBUTTON', function() {
        vm.showButton = false;
        console.log('actionMenu::HIDEBUTTON');
      });

      vm.init = function () {
        authentication.credential(function (err, data, status) {
          if (err || status !== 200) {
            authentication.logOut();
            vm.goTo(URLS.LOGIN());
          }
        });
      };

      vm.goTo = function (path) {
        $mdSidenav('left').close();
        $location.path(path);
      };

      vm.ensureAuthenticated = function () {
        return authentication.isAuthenticated() && localSave.getValueLS(LOCALNAME.PERSON_ID);
      };

      vm.test = function () {
        $scope.$broadcast('actionMenu::HIDEBUTTON');
        //$scope.$broadcast('actionDirective::NEW');
        /*localSave.setValueLS(LOCALNAME.USER_TOKEN, 'sadasd');*/
      };


      function debounce(func, wait, context) {
        var timer;
        return function debounced() {
          var context = $scope,
            args = Array.prototype.slice.call(arguments);
          $timeout.cancel(timer);
          timer = $timeout(function () {
            timer = undefined;
            func.apply(context, args);
          }, wait || 10);
        };
      }

      function buildDelayedToggler(navID) {
        return debounce(function () {
          var user = localSave.getJSONValueLS(LOCALNAME.SESSION_USER);
          var person = localSave.getJSONValueLS(LOCALNAME.PERSON_ID);
          vm.user._id = user._id;
          vm.user.email = user.email;
          vm.user.username = user.username;
          vm.user.pass = '';
          vm.user.last_login = user.last_login;
          vm.user.student_id = user.student_id;
          vm.user.teachers_id = user.teachers_id;
          vm.user.manager_id = user.manager_id;
          vm.user.master_id = user.master_id;
          vm.person['_id'] = person._id;
          vm.person['name'] = person.name;
          vm.person['type'] = person.type;
          buildMenu();

          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        }, 200);
      }

      function buildToggler(navID) {
        return function () {
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        }
      }

      vm.closeLeft = function () {
        $mdSidenav('left').close()
          .then(function () {
            $log.debug("close LEFT is done");
          });
      };

      vm.closeRight = function () {
        $mdSidenav('right').close()
          .then(function () {
            $log.debug("close RIGHT is done");
          });
      };


      function buildMenu() {
        console.log('show');
        vm.mainMenu = [];
        var type = localSave.getJSONValueLS(LOCALNAME.PERSON_ID).type;
        console.log(type);
        switch (type) {
          case 'student':
            vm.mainMenu = [
              {
                url: URLS.HOME(),
                name: 'Home',
                icon: 'images/ic_home.svg'
              },
              {
                url: URLS.COURSES(),
                name: 'Cursos',
                icon: 'images/ic_blocks.svg'
              },
              {
                url: URLS.ACCOUNT(),
                name: 'Minha Conta',
                icon: 'images/ic_user.svg'
              }
            ];
            break;
          case 'teacher':
            vm.mainMenu = [
              {
                url: URLS.HOME(),
                name: 'Home',
                icon: 'images/ic_home.svg'
              },
              {
                url: URLS.COURSES(),
                name: 'Cursos',
                icon: 'images/ic_blocks.svg'
              },
              {
                url: URLS.STUDENTS(),
                name: 'Alunos',
                icon: 'images/ic_cicleinside.svg'
              },
              {
                url: URLS.ACCOUNT(),
                name: 'Minha Conta',
                icon: 'images/ic_user.svg'
              }
            ];
            break;
          case 'manager':
            vm.mainMenu = [
              {
                url: URLS.HOME(),
                name: 'Home',
                icon: 'images/ic_home.svg'
              },
              {
                url: URLS.COURSES(),
                name: 'Cursos',
                icon: 'images/ic_blocks.svg'
              },
              {
                url: URLS.STUDENTS(),
                name: 'Alunos',
                icon: 'images/ic_cicleinside.svg'
              },
              {
                url: URLS.TEACHERS(),
                name: 'Professores',
                icon: 'images/ic_teacher.svg'
              },
              {
                url: URLS.ACCOUNT(),
                name: 'Minha Conta',
                icon: 'images/ic_user.svg'
              }
            ];
            break;
          case 'master':
            vm.mainMenu = [
              {
                url: URLS.HOME()(),
                name: 'Home',
                icon: 'images/ic_home.svg'
              },
              {
                url: URLS.COURSES(),
                name: 'Cursos',
                icon: 'images/ic_blocks.svg'
              },
              {
                url: URLS.STUDENTS(),
                name: 'Alunos',
                icon: 'images/ic_cicleinside.svg'
              },
              {
                url: URLS.TEACHERS(),
                name: 'Professores',
                icon: 'images/ic_teacher.svg'
              },
              {
                url: URLS.USERS(),
                name: 'Usuários',
                icon: 'images/ic_cubic.svg'
              },
              {
                url: URLS.ACCOUNT(),
                name: 'Minha Conta',
                icon: 'images/ic_user.svg'
              }
            ];
            break;
        }
        return vm.mainMenu;
      }
    }]);

}(angular, frontApp));
