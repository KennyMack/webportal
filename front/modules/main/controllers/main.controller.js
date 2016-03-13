
(function (angular, frontApp) {
  'use strict';
angular.module(frontApp.modules.main.name)
  .controller(frontApp.modules.main.controllers.main.name, [ function () {

  }]);
}(angular, frontApp));
/*      var vm = this;
      vm.toggleLeft = buildDelayedToggler('left');
      vm.toggleRight = buildToggler('right');
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

      vm.imagePath = '../images/android.svg';
    }])

  .controller('MainSideNavLeftCtrl', function ($timeout, $mdSidenav, $log) {
    var vm = this;
    vm.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  })
  .controller('MainSideNavRightCtrl', function ($timeout, $mdSidenav, $log) {
    var vm = this;
    vm.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  });*/
