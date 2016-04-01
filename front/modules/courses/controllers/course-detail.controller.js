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
      '$rootScope',
      '$mdDialog',
      '$mdMedia',
      function (resource, request, courses, messages, $location,
                $routeParams, $filter, $scope, $rootScope,
                $mdDialog, $mdMedia) {
        var vm = this;
        vm.course = null;
        vm.schedule = [];

        vm.init = function () {
          $rootScope.__showButton = false;
          courses.getCourse($routeParams.idcourse)
            .then(function (courses) {
              vm.course = courses.data;
              for (var i = 0, length = courses.data.schedule.length; i < length; i++) {
                vm.schedule.push({
                  _id: courses.data.schedule[i]['_id'],
                  day_num: courses.data.schedule[i]['day'],
                  day: DAYS.DAY_DESCRIPTION(courses.data.schedule[i]['day']),
                  subject: courses.data.schedule[i]['subject']['description'],
                  duration: {
                    start: $filter('date')(courses.data.schedule[i]['duration']['start'], 'HH:mm'),
                    end: $filter('date')(courses.data.schedule[i]['duration']['end'], 'HH:mm')
                  },
                  teacher: getTeacher(courses.data.schedule[i]['subject']['_id'])
                });
              }
              vm.schedule = $filter('orderBy')(vm.schedule, 'day_num');
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
            return 'a';
          }
        };

        vm.addSchedule = function () {
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
                status: 'NEW'
              },
              fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
            })
              .then(function (course, status) {
                console.log(course);
                if (status === 'NEW') {
                  vm.schedule.push({
                    _id: course.schedule[i]['_id'],
                    day_num: course.schedule[i]['day'],
                    day: DAYS.DAY_DESCRIPTION(course.schedule[i]['day']),
                    subject: course.schedule[i]['subject']['description'],
                    duration: {
                      start: $filter('date')(course.schedule[i]['duration']['start'], 'HH:mm'),
                      end: $filter('date')(course.schedule[i]['duration']['end'], 'HH:mm')
                    },
                    teacher: getTeacher(course.schedule[i]['subject']['_id'])
                  });
                }

                /*if (action === 'NEW') {
                 vm.courseslist.push(course);
                 }
                 else {
                 var foundCourse = $filter('filter')(vm.courseslist, {_id: vm.selectedCourseIndex});
                 foundCourse[0].name = course.name;
                 foundCourse[0].identify = course.identify;
                 foundCourse[0].description = course.description;
                 foundCourse[0].active = course.active;
                 foundCourse[0].course_type._id = course.course_type._id;
                 foundCourse[0].course_type.description = course.course_type.description;
                 foundCourse[0].duration.start = Date.parse(course.duration.start);
                 foundCourse[0].duration.end = Date.parse(course.duration.end);
                 }*/

              }, function (err) {
                // TODO: implementar mensagens de erro
              });
          }
          else
            messages.alert('Cronograma', 'Este curso ainda não possui nenhuma matéria relacionada.', 'btn-add-schedule', 'btn-add-schedule');
        };

        vm.optionClicked = function (index, id) {
          if(index == 0) {
            // TODO: alterar schedule
          }
          else {
            removeSchedule(id);
          }
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
