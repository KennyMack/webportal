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
    '$log', '$location', '$rootScope',
    function (LOCALNAME,
              authentication, localSave, users,
              $scope, $timeout, $mdSidenav,
              $log, $location, $rootScope) {
      var self = this;
      self.mainMenu = [];
      self.user = users.getUser();
      self.person = {};
      self.toggleLeft = buildDelayedToggler('left');
      self.toggleRight = buildToggler('right');
      self.isOpen = false;


      self.selectedMode = 'md-fling';
      self.imagePath = '../images/android.svg';

      self.actionMenu = function (action) {
        $scope.$broadcast('actionMenu::'+ action);
      };

      self.init = function () {
        /*authentication.credential(function (err, data, success, status) {
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
          if (err || status !== 200) {
            authentication.logOut();
            self.goTo(URLS.LOGIN());
          }
        });*/
      };

      self.goTo = function (path) {
        $mdSidenav('left').close();
        $location.path(path);
      };

      self.ensureAuthenticated = function () {
        return authentication.isAuthenticated() && localSave.getValueLS(LOCALNAME.PERSON_ID);
      };

      self.test = function () {
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
          self.user._id = user._id;
          self.user.email = user.email;
          self.user.username = user.username;
          self.user.pass = '';
          self.user.last_login = user.last_login;
          self.user.student_id = user.student_id;
          self.user.teachers_id = user.teachers_id;
          self.user.manager_id = user.manager_id;
          self.user.master_id = user.master_id;
          self.person['_id'] = person._id;
          self.person['name'] = person.name;
          self.person['type'] = person.type;
          buildMenu();

          $mdSidenav(navID)
            .toggle()
            .then(function () {
              //$log.debug("toggle " + navID + " is done");
            });
        }, 200);
      }

      function buildToggler(navID) {
        return function () {
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              //$log.debug("toggle " + navID + " is done");
            });
        }
      }

      self.closeLeft = function () {
        $mdSidenav('left').close()
          .then(function () {
            //$log.debug("close LEFT is done");
          });
      };

      self.closeRight = function () {
        $mdSidenav('right').close()
          .then(function () {
            //$log.debug("close RIGHT is done");
          });
      };


      function buildMenu() {
        self.mainMenu = [];
        var type = localSave.getJSONValueLS(LOCALNAME.PERSON_ID).type;
        switch (type) {
          case 'student':
            self.mainMenu = [
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
            self.mainMenu = [
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
            self.mainMenu = [
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
            self.mainMenu = [
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
        return self.mainMenu;
      }
    }]);

}(angular, frontApp));
