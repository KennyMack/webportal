/**
 * Created by jonathan on 31/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courseSchedule.name, [
      frontApp.modules.courses.imports.request,
      'status',
      '$routeParams',
      '$mdDialog',
      '$q',
      '$timeout',
      function (request, status, $routeParams, $mdDialog, $q, $timeout
                ) {
        var vm = this;
        vm.subjects = [];
        vm.newSchedule = {
          _id: '',
          schedule: {
            _id: '',
            day: -1,
            subject: '',
            duration: {
              start: new Date(),
              end: new Date()
            }
          }
        };

        vm.timeStart ={
          hour:0,
          minute:0
        };
        vm.timeEnd ={
          hour:0,
          minute:0
        };

        vm.currentDateMinMax = new Date();
        vm.currentTime= new Date();

        vm.selectedItem  = null;
        vm.searchText    = null;
        vm.querySearch   = querySearch;

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
          console.log(status);
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
          var date = new Date();
          var schedule = {
            day: vm.newSchedule.schedule.day,
            subject: vm.selectedItem._id,
            duration: {
              start:new Date(date.getFullYear(), date.getMonth(), date.getDay(),
                             vm.timeStart.hour, vm.timeStart.minute,
                             0, 0),
                end:new Date(date.getFullYear(), date.getMonth(), date.getDay(),
                             vm.timeEnd.hour, vm.timeEnd.minute,
                             0, 0)
            }
          };

          console.log(vm.newSchedule);
          console.log(new Date());
          request.post(URLS.COURSEADDSCHEDULE($routeParams.idcourse), schedule, function (err, data) {
              if (!err){
                $mdDialog.hide(data.data);
              }
              else {
                //TODO: Implementar tratativa de erro
                alert(data.data, status);
              }

          });

          //$mdDialog.hide();
        };

      }]);
}(angular, frontApp));
