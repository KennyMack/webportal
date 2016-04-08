/**
 * Created by jonathan on 31/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courseSchedule.name, [
      frontApp.modules.courses.imports.request,
      frontApp.modules.courses.imports.messages,
      '_Schedule',
      '$routeParams',
      '$mdDialog',
      '$q',
      '$timeout',
      '$filter',
      function (request, messages, _Schedule, $routeParams, $mdDialog, $q, $timeout,
                $filter) {
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
          var lowercaseQuery = $filter('removeAccentsFilter')(angular.lowercase(query));
          return function filterFn(state) {
            return ($filter('removeAccentsFilter')(state.description.toLowerCase()).indexOf(lowercaseQuery) === 0);
          };
        }

        vm.init = function () {
          if (_Schedule) {
            vm.newSchedule['schedule']['_id'] = _Schedule['_id'];
            vm.newSchedule['schedule']['day'] = _Schedule['day_num'];
            vm.selectedItem = _Schedule['subject'];
            var start = _Schedule['duration']['start'].split(':');
            var end = _Schedule['duration']['end'].split(':');
            vm.timeStart.hour = start[0] || 0;
            vm.timeStart.minute = start[1] || 0;
            vm.timeEnd.hour = end[0] || 0;
            vm.timeEnd.minute = end[1] || 0;
          }

          request.get(URLS.COURSESUBJECTS($routeParams.idcourse), function (err, data) {
            if(!err) {
              for (var i = 0, length = data.data.subjects.length; i < length; i++) {
                vm.subjects.push({
                    _id: data.data.subjects[i].subject._id,
                    description: data.data.subjects[i].subject.description
                });
              }

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
          //TODO: Implementar o salvar da edição
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
          request.post(URLS.COURSEADDSCHEDULE($routeParams.idcourse), schedule, function (err, data) {
              if (!err){
                $mdDialog.hide(data.data);
              }
              else {
                //TODO: Implementar tratativa de erro
                alert(data.data);
              }

          });

          //$mdDialog.hide();
        };

      }]);
}(angular, frontApp));
