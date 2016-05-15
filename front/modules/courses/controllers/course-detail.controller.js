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
        var idCourse = $routeParams.idcourse;

        // initializes view controllers
        self.init = function () {
          courses.getCourse(idCourse)
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

        // Load local subjects
        var loadSubjects = function (subjects) {
          self.subjects = subjects;
        };

        // Load local Schedules
        var loadSchedules = function (schedules) {
          self.schedule = [];

          // through all the subjects of course
          for (var i = 0, lenSubject = schedules.length; i < lenSubject; i++) {

            // through all the schedules of subject
            for (var r = 0, lenSchedule = schedules[i].schedule.length; r < lenSchedule; r++) {
              // create a item schedule
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
              // add schedule to local schedules
              self.schedule.push(item);
            }
          }
          // ordenying schedules by day
          self.schedule = $filter('orderBy')(self.schedule, 'day_num');
        };

        // create a new Subject
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
              loadSchedules(course.subjects);

            }, function () {
              // TODO: implementar mensagens de erro
            });
        };

        // create a new Schedule
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
              locals: {
                _Schedule: undefined
              },
              fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
            })
              .then(function (course) {
                loadSchedules(course.subjects);

              }, function () {
                // TODO: implementar mensagens de erro
              });
          }
          else
            messages.alert('Cronograma', 'Este curso ainda não possui nenhuma matéria relacionada.', 'btn-add-schedule', 'btn-add-schedule');
        };

        // Menu course options
        self.optionClicked = function (index, idSubject, id) {
          removeSchedule(idSubject, id);
        };

        // Remove Subject
        self.removeSubject = function (id) {
          messages.confirm('Exclusão', 'Confirma a exclusão da matéria, todas os horários vinculados serão removidos ?', 'opt-subjects-' + id, 'tbl-subjects')
            .then(function () {
              // Delete Subject
              request.delete(URLS.COURSEREMOVESUBJECT(idCourse, id))
                .then(function (data) {
                  if (data.status === 200) {

                    // Updating local subjects
                    var subjectItem = $filter('filter')(self.subjects, {_id: id})[0];
                    self.subjects.splice(self.subjects.indexOf(subjectItem), 1);

                    // updating local schedules
                    loadSchedules(self.subjects);
                  }
                })
                .catch(function () {
                  messages.alert('Aviso', 'Não foi possível remover a matéria.', 'opt-subjects-' + id, 'tbl-subjects');
                });
            },
            function () {

            });
        };

        // Remove Schedule
        var removeSchedule = function (subject, id) {
          messages.confirm('Exclusão', 'Confirma a exclusão do horário ?', 'opt-schedule-' + id, 'tbl-schedule')
            .then(function () {
              // Delete Schedule
              request.delete(URLS.COURSEREMOVESCHEDULE(idCourse, subject, id))
                .then(function (data) {
                  if (data.status === 200) {
                    // Updating local schedules
                    var scheduleItem = $filter('filter')(self.schedule, {_id: id})[0];
                    self.schedule.splice(self.schedule.indexOf(scheduleItem), 1);

                    /*for (var i = 0, length = self.schedule.length; i < length; i++) {
                     if (self.schedule[i]._id === id){
                     self.schedule.splice(i, 1);
                     break;
                     }
                     }*/
                  }
                })
                .catch(function () {
                  messages.alert('Aviso', 'Não foi possível remover o horário selecionado.', 'opt-subjects-' + id, 'tbl-subjects');
                });
            },
            function () {

            });
        }

      }]);
}(angular, frontApp));
