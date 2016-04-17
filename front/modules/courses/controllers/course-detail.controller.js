/**
 * Created by jonathan on 25/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courseDetail.name, [
      frontApp.modules.courses.imports.resource,
      frontApp.modules.courses.imports.request,
      frontApp.modules.courses.factories.courses,
      frontApp.modules.courses.imports.messages,
      '$location',
      '$routeParams',
      '$filter',
      '$scope',
      '$mdDialog',
      '$mdMedia',
      function (resource, request, courses, messages, $location,
                $routeParams, $filter, $scope,
                $mdDialog, $mdMedia) {
        var self = this;
        self.course = null;
        self.schedule = [];
        self.subjects = [];

        self.init = function () {
          courses.getCourse($routeParams.idcourse)
            .then(function (courses) {
              self.course = courses.data;
              loadSchedules(courses.data.subjects);
              loadSubjects(courses.data.subjects);
              courses.data = null;
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var loadSubjects = function (subjects) {
          self.subjects = subjects;
        };

        var loadSchedules = function (schedules) {
          self.schedule = [];
          for (var i = 0, lenSubject = schedules.length; i < lenSubject; i++) {
            for (var r = 0, lenSchedule = schedules[i].schedule.length; r < lenSchedule; r++) {
              var item = {
                _id: schedules[i].schedule[r]['_id'],
                day_num: schedules[i].schedule[r]['day'],
                day: DAYS.DAY_DESCRIPTION(schedules[i].schedule[r]['day']),
                subject: {
                  description: schedules[i]['subject']['description'],
                  _id: schedules[i]['subject']['_id']
                },
                duration: {
                  start: $filter('date')(schedules[i].schedule[r]['duration']['start'], 'HH:mm'),
                  end: $filter('date')(schedules[i].schedule[r]['duration']['end'], 'HH:mm')
                },
                teacher: schedules[i]['teacher']['name']
              };
              self.schedule.push(item);
            }
          }
          self.schedule = $filter('orderBy')(self.schedule, 'day_num');
        };

        self.addSubjects = function () {
          $mdDialog.show({
            templateUrl: '../../../templates/coursesSubjectsForm.tpl.html',
            openFrom: '#btn-add-subjects',
            closeTo: '#tbl-subjects',
            controllerAs: frontApp.modules.courses.controllers.courseSubject.nameas,
            controller: frontApp.modules.courses.controllers.courseSubject.name,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
          })
            .then(function (course) {
              loadSubjects(course.subjects);
              loadSchedules();

            }, function (err) {
              // TODO: implementar mensagens de erro
            });
        };

        self.addSchedule = function () {
          if (self.subjects.length > 0) {
            $mdDialog.show({
              templateUrl: '../../../templates/courseScheduleForm.tpl.html',
              openFrom: '#btn-add-schedule',
              closeTo: '#tbl-schedule',
              controllerAs: frontApp.modules.courses.controllers.courseSchedule.nameas,
              controller: frontApp.modules.courses.controllers.courseSchedule.name,
              parent: angular.element(document.body),
              clickOutsideToClose: false,
              locals:{
                _Schedule: undefined
              },
              fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
            })
              .then(function (course) {
                loadSchedules(course.subjects);

              }, function (err) {
                // TODO: implementar mensagens de erro
              });
          }
          else
            messages.alert('Cronograma', 'Este curso ainda não possui nenhuma matéria relacionada.', 'btn-add-schedule', 'btn-add-schedule');
        };

        /* TODO: Implementação futura - Atualização do Schedule
        var updateSchedule = function (schedule) {
          if (self.course.subjects.length > 0) {
            $mdDialog.show({
              templateUrl: '../../../templates/courseScheduleForm.tpl.html',
              openFrom: '#btn-add-schedule',
              closeTo: '#tbl-schedule',
              controllerAs: frontApp.modules.courses.controllers.courseSchedule.nameas,
              controller: frontApp.modules.courses.controllers.courseSchedule.name,
              parent: angular.element(document.body),
              clickOutsideToClose: false,
              locals: {
                _Schedule:  schedule
              },
              fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
            })
              .then(function (course) {
                loadSchedules(course.schedule);

              }, function (err) {
                // TODO: implementar mensagens de erro
              });
          }
          else
            messages.alert('Cronograma', 'Este curso ainda não possui nenhuma matéria relacionada.', 'btn-add-schedule', 'btn-add-schedule');
        };*/

        self.optionClicked = function (index, idSubject, id) {
          /*TODO: Implementação futura - Atualização do Schedule
          if(index == 0) {
            updateSchedule($filter('filter')(self.schedule,{ _id: id} )[0]);
          }
          else {*/
            removeSchedule(idSubject, id);
          //}
        };

        self.removeSubject = function (id) {
          messages.confirm('Exclusão', 'Confirma a exclusão da matéria, todas os horários vinculados serão removidos ?', 'opt-subjects-'+id, 'tbl-subjects')
            .then(function () {
              request.delete(URLS.COURSEREMOVESUBJECT($routeParams.idcourse, id),
                function (err, data, status) {
                  if(!err && status === 200 ){
                    for (var i = 0, length = self.subjects.length; i < length; i++) {
                      if (self.subjects[i]._id === id){
                        self.subjects.splice(i, 1);
                        break;
                      }
                    }
                    loadSchedules(self.subjects);
                  }
                });
            },
            function () {

            });
        };

        var removeSchedule = function (subject, id) {
          messages.confirm('Exclusão', 'Confirma a exclusão do horário ?', 'opt-schedule-'+id, 'tbl-schedule')
            .then(function () {
              request.delete(URLS.COURSEREMOVESCHEDULE($routeParams.idcourse, subject, id),
                function (err, data, status) {
                  if(!err && status === 200 ){
                    for (var i = 0, length = self.schedule.length; i < length; i++) {
                      if (self.schedule[i]._id === id){
                        self.schedule.splice(i, 1);
                        break;
                      }
                    }
                  }
                });
            },
            function () {

            });
        }

      }]);
}(angular, frontApp));
