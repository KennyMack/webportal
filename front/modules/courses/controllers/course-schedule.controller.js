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
        var self = this;
        self.subjects = [];
        self.error = [];
        self.fieldError = false;
        self.textF = 'hello';
        self.newSchedule = {
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

        self.timeStart ={
          hour:0,
          minute:0
        };
        self.timeEnd ={
          hour:0,
          minute:0
        };

        self.currentDateMinMax = new Date();
        self.currentTime= new Date();

        self.selectedItem  = null;
        self.searchText    = null;
        self.querySearch   = querySearch;

        function querySearch (query) {
          var results = query ? self.subjects.filter( createFilterFor(query) ) : self.subjects;
          var deferred = $q.defer();
          $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
          return deferred.promise;
        }

        function createFilterFor(query) {
          return function filterFn(subject) {
            return $filter('searchFilter')(query, subject.description) > -1;
          };
        }

        self.init = function () {
          if (_Schedule) {
            self.newSchedule['schedule']['_id'] = _Schedule['_id'];
            self.newSchedule['schedule']['day'] = _Schedule['day_num'];
            self.selectedItem = _Schedule['subject'];
            var start = _Schedule['duration']['start'].split(':');
            var end = _Schedule['duration']['end'].split(':');
            self.timeStart.hour = start[0] || 0;
            self.timeStart.minute = start[1] || 0;
            self.timeEnd.hour = end[0] || 0;
            self.timeEnd.minute = end[1] || 0;
          }

          request.get(URLS.COURSESUBJECTS($routeParams.idcourse), function (err, data) {
            if(!err) {
              for (var i = 0, length = data.data.subjects.length; i < length; i++) {
                self.subjects.push({
                    _id: data.data.subjects[i].subject._id,
                    description: data.data.subjects[i].subject.description
                });
              }

            }
            else
              messages.alert('Matérias', 'Não foi possível carregar as matérias.');
          })
        };

        self.getDayDescription = function (day) {
          return DAYS.DAY_DESCRIPTION(day);
        };

        self.closeClick = function () {
          $mdDialog.cancel();
        };

        self.cancelClick = function () {
          $mdDialog.cancel();
        };

        self.saveClick = function () {
          //TODO: Implementar o salvar da edição
          /*var date = new Date();
          var schedule = {
            day: self.newSchedule.schedule.day,
            subject: self.selectedItem._id,
            duration: {
              start:new Date(date.getFullYear(), date.getMonth(), date.getDay(),
                             self.timeStart.hour, self.timeStart.minute,
                             0, 0),
                end:new Date(date.getFullYear(), date.getMonth(), date.getDay(),
                             self.timeEnd.hour, self.timeEnd.minute,
                             0, 0)
            }
          };
          request.post(URLS.COURSEADDSCHEDULE($routeParams.idcourse), schedule, function (err, data) {
              if (!err && data.success){
                $mdDialog.hide(data.data);
              }
              else {
                //TODO: Implementar tratativa de erro
                self.error.push(data.data.subject);
              }

          });*/

          //$mdDialog.hide();
        };

      }]);
}(angular, frontApp));
