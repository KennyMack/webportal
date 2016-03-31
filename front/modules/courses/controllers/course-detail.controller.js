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
          $mdDialog.show({
            templateUrl: '../../../templates/courseScheduleForm.tpl.html',
            openFrom: '#btn-add-schedule',
            closeTo: '#tbl-schedule',
            /*locals: {
              courseType: types,
              courses: courses,
              action: action,
              Course: courses.Course(),
              id_course: vm.selectedCourseIndex
            },*/
            controllerAs: frontApp.modules.courses.controllers.courseSchedule.nameas,
            controller:frontApp.modules.courses.controllers.courseSchedule.name,/* ['$scope', 'courseType', 'pageHeader', '$q',
              'courses', 'action', 'Course', 'id_course',
              function ($scope, courseType, pageHeader, $q,
                        courses, action, Course, id_course) {
                var vm = this;
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

                vm.init = function () {
                  if (action !== 'NEW') {
                    Course.get({Id: id_course}, function (course) {
                      vm.newCourse = {
                        _id: id_course,
                        name: course.data.name,
                        identify: course.data.identify,
                        description: course.data.description,
                        active: course.data.active,
                        course_type: {
                          _id: course.data.course_type._id,
                          description: course.data.course_type.description
                        },
                        duration: {
                          start: new Date(course.data.duration.start),
                          end: new Date(course.data.duration.end)
                        }
                      };
                    });
                  }
                };

                vm.courseType = courseType;
                vm.pageHeader = pageHeader;

                vm.closeClick = function () {
                  $mdDialog.cancel();
                };

                vm.cancelClick = function () {
                  $mdDialog.cancel();
                };

                vm.saveClick = function () {
                  //TODO: Construir a validacao antes de inserir
                  vm.newCourse.course_type.description = document.getElementById('cbe-course-type').innerText;
                  vm.newCourse.duration.start = moment(vm.newCourse.duration.start)._d;
                  vm.newCourse.duration.end = moment(vm.newCourse.duration.end)._d;

                  if (action === 'NEW') {
                    var objCourse = new Course(vm.newCourse);
                    objCourse.$post(function (course) {
                      if (course.success)
                        $mdDialog.hide(course.data);
                      else {
                        console.log(course.data);
                        // TODO: implementar mensagens de erro
                      }
                    });
                  }
                  else {

                    Course.put({}, vm.newCourse, function (course) {
                      if (course.success) {
                        $mdDialog.hide(course.data);
                      }
                      else {
                        console.log(course.data);
                        // TODO: implementar mensagens de erro
                      }
                    });
                  }
                };
              }],*/
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
          })
            .then(function (course) {
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
