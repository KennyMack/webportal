/**
 * Created by jonathan on 31/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courseSchedule.name, [
      frontApp.modules.courses.imports.request,
      '$routeParams',
      '$mdDialog',
      '$q',
      '$timeout',
      '$mdpDatePicker',
      '$mdpTimePicker',
      function (request, $routeParams, $mdDialog, $q, $timeout,
                $mdpDatePicker, $mdpTimePicker) {
        var vm = this;
        vm.subjects = [];
        vm.newCourse = {
          _id: '',
          name: '',
          identify: '',
          description: '',
          active: '',
          course_type: {
            _id: '',
            description: ''
          },
          duration: {
            start: new Date(),
            end: new Date()
          }
        };

        vm.currentDateMinMax = new Date();
        vm.currentTime= new Date();

        vm.selectedItem  = null;
        vm.searchText    = null;
        vm.querySearch   = querySearch;

        vm.showTimePicker = function(ev) {
          $mdpTimePicker(vm.currentTime, {
            targetEvent: ev
          }).then(function(selectedDate) {
            vm.currentTime = selectedDate;
          });
        };

        function querySearch (query) {
          var results = query ? vm.subjects.filter( createFilterFor(query) ) : vm.subjects;
          var deferred = $q.defer();
          $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
          return deferred.promise;
        }

        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(state) {
            return (state.description.toLowerCase().indexOf(lowercaseQuery) === 0);
          };
        }

        vm.init = function () {
          request.get(URLS.SUBJECTS(), function (err, data) {
            if(!err) {
              vm.subjects = data.data;
            }
            else
              messages.alert('Matérias', 'Não foi possível carregar as matérias.');
          })
        };

        vm.getDayDescription = function (day) {
          return DAYS.DAY_DESCRIPTION(day);
        };

        vm.closeClick = function () {
          $mdDialog.cancel();
        };

        vm.cancelClick = function () {
          $mdDialog.cancel();
        };

        vm.saveClick = function () {
          console.log(vm.selectedItem);
          //$mdDialog.hide();
        };

      }]);
}(angular, frontApp));
