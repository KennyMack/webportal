/**
 * Created by jonathan on 13/03/16.
 */
'use strict';
angular.module('frontApp')
  .controller('IndexCtrl', function (authentication,
                                     $scope,
                                     $timeout,
                                     $mdSidenav,
                                     $log,
                                     $location,
                                     localSave,
                                     users) {
    var vm = this;
    vm.user = users.getUser();
    vm.person = {};
    vm.toggleLeft = buildDelayedToggler('left');
    vm.toggleRight = buildToggler('right');


    vm.init = function () {
      authentication.credential(function (err, data, status) {
        if(err || status === 401) {
          authentication.logOut();
          vm.goTo('/login');
        }
      });
    };

    vm.test = function () {
      localSave.setValueLS('User-Token', 'sdsds');

    };



    vm.goTo = function (path) {
      $mdSidenav('left').close();
      $location.path(path);
    };

    vm.ensureAuthenticated = function () {
      return authentication.isAuthenticated() && localSave.getValueLS('PERSON-ID');
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
        var user = localSave.getJSONValueLS('Session-User');
        var person = localSave.getJSONValueLS('PERSON-ID');
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

    vm.imagePath = '../images/android.svg';
  });
