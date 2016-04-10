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
        var vm = this;
        vm.course = null;
        vm.schedule = [];
        vm.subjects = [];

        vm.init = function () {
          courses.getCourse($routeParams.idcourse)
            .then(function (courses) {
              vm.course = courses.data;
              loadSchedules(courses.data.schedule);
              loadSubjects(courses.data.subjects);


              courses.data = null;
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var getTeacher = function (id) {
          try {
            return $filter('filter')(vm.course.subjects,{ subject: {_id: id}})[0].teacher.name;
          }
          catch(ex) {
            return '';
          }
        };

        var loadSubjects = function (subjects) {
          vm.subjects = subjects;
        };

        var loadSchedules = function (schedules) {
          vm.schedule = [];

          for (var i = 0, length = schedules.length; i < length; i++) {
            vm.schedule.push({
              _id: schedules[i]['_id'],
              day_num: schedules[i]['day'],
              day: DAYS.DAY_DESCRIPTION(schedules[i]['day']),
              subject: {
                description: schedules[i]['subject']['description'],
                _id: schedules[i]['subject']['_id']
              },
              duration: {
                start: $filter('date')(schedules[i]['duration']['start'], 'HH:mm'),
                end: $filter('date')(schedules[i]['duration']['end'], 'HH:mm')
              },
              teacher: getTeacher(schedules[i]['subject']['_id'])
            });
          }
          vm.schedule = $filter('orderBy')(vm.schedule, 'day_num');
        };

        vm.addSubjects = function () {
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

            }, function (err) {
              // TODO: implementar mensagens de erro
            });
        };

        vm.addSchedule = function () {
          if (vm.subjects.length > 0) {
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
                loadSchedules(course.schedule);

              }, function (err) {
                // TODO: implementar mensagens de erro
              });
          }
          else
            messages.alert('Cronograma', 'Este curso ainda não possui nenhuma matéria relacionada.', 'btn-add-schedule', 'btn-add-schedule');
        };

        /* TODO: Implementação futura - Atualização do Schedule
        var updateSchedule = function (schedule) {
          if (vm.course.subjects.length > 0) {
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

        vm.optionClicked = function (index, id) {
          /*TODO: Implementação futura - Atualização do Schedule
          if(index == 0) {
            updateSchedule($filter('filter')(vm.schedule,{ _id: id} )[0]);
          }
          else {*/
            removeSchedule(id);
          //}
        };

        var removeSchedule = function (id) {
          messages.confirm('Exclusão', 'Confirma a exclusão do horário ?', 'opt-schedule-'+id, 'tbl-schedule')
            .then(function () {
              request.delete(URLS.COURSEREMOVESCHEDULE($routeParams.idcourse, id),
                function (err, data, status) {
                  if(!err && status === 200 ){
                    for (var i = 0, length = vm.schedule.length; i < length; i++) {
                      if (vm.schedule[i]._id === id){
                        vm.schedule.splice(i, 1);
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
