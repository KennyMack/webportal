/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courses.name, [
      frontApp.modules.courses.imports.resource,
      frontApp.modules.courses.imports.request,
      frontApp.modules.courses.imports.messages,
      frontApp.modules.courses.factories.courses,
      '$controller',
      '$scope',
      '$filter',
      '$location',
      '$mdDialog',
      '$mdMedia',
      function (resource, request, messages, courses,
                $controller, $scope, $filter, $location,
                $mdDialog, $mdMedia) {
        var vm = this;
        var GridListCtrl = $controller(frontApp.modules.courses.imports.gridlistctrl, {$scope: $scope});
        var active = true;
        vm.expandedTextIndex = undefined;
        vm.undefinedIndex = true;
        vm.selectedCourseIndex = undefined;
        vm.courseslist = [];
        vm.yearsList = [];

        $scope.$on('actionMenu::NEW', function() {
          request.get(URLS.COURSETYPE(),
            function (err, data) {
              if(!err) {
                formAction('NEW', data.data);
              }
              else
                messages.alert('Tipo de curso', 'Não foi possível carregar os tipos de cursos.', 'bt-action-menu-NEW', 'bt-action-menu-NEW');
            })

        });

        $scope.$on('actionMenu::EDIT', function() {
          if (vm.selectedCourseIndex != undefined) {
            request.get(URLS.COURSETYPE(),
              function (err, data) {
                if (!err) {
                  formAction('EDIT', data.data);
                }
                else
                  messages.alert('Tipo de curso', 'Não foi possível carregar os tipos de cursos.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
              });
          }
          else {
            messages.alert('Edição', 'Selecione um curso para realizar a edição.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
          }
        });

        $scope.$on('actionMenu::REMOVE', function() {
          vm.removeCourse();
        });

        vm.menuActionsCard = function (index) {
          if (vm.selectedCourseIndex === index) {
            active = !active;
          }
        };

        vm.optionClicked = function (index) {

          if(index === 0){
            $location.path(URLS.COURSEDETAIL(vm.selectedCourseIndex));
          }

        };

        vm.removeCourse = function () {
          if (vm.selectedCourseIndex != undefined) {
            messages.confirm('Exclusão', 'Confirma a exclusão do curso ?', 'bt-action-menu-REMOVE', 'grid-courses')
              .then(function () {
                request.delete(URLS.COURSES(vm.selectedCourseIndex),
                  function (err, data, status) {
                    if(!err && status === 200 ){
                      for (var i = 0, length = vm.courseslist.length; i < length; i++) {
                        if (vm.courseslist[i]._id === vm.selectedCourseIndex){
                          vm.courseslist.splice(i, 1);
                        }

                      }

                      createYearList();
                    }
                  });
              },
              function () {

              });
          }
          else {
            messages.alert('Exclusão', 'Selecione um curso para realizar a exclusão.', 'bt-action-menu-REMOVE', 'bt-action-menu-REMOVE');
          }
        };

        vm.init = function () {

          courses.getCourses()
            .then(function (courses) {
              vm.courseslist = [];
              vm.yearsList = [];
              vm.courseslist = courses.data;
              createYearList();
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var createYearList = function () {
          vm.yearsList = [];
          for (var i = 0, length = vm.courseslist.length; i < length; i++) {
            var year = $filter('date')(vm.courseslist[i]['duration']['start'], 'yyyy');
            if (!yearInList(year)) {
              vm.yearsList.push({'name': year});
            }
            vm.courseslist[i]['year'] = year;
          }
        };

        var yearInList = function (year) {
          return $filter('filter')(vm.yearsList, { name: year }).length > 0;
        };

        vm.showClass = function (idCourse, students) {
          var studentsClass = [];

          if (students.length > 0) {
            for (var r = 0, length = students.length; r < length; r++) {
              studentsClass.push({
                id: students[r]._id,
                valueA: students[r].name
              });
            }

            var grid = {
              header: 'Alunos',
              data: studentsClass,
              destiny: 'btn-class-' + idCourse
            };

            GridListCtrl.showGrid(grid)
              .then(function (student) {
                console.log(student);
                studentsClass.length = 0;
              }, function (err) {
                console.error(err);
                studentsClass.length = 0;
              });
          }
          else
            messages.alert('Alunos', 'Esse curso não possui alunos.', 'btn-class-' + idCourse, 'btn-class-' + idCourse);
        };

        vm.showSubjects = function (idCourse, subjects) {
          var subjectsCourse = [];

          if (subjects.length > 0) {
            for (var r = 0, length = subjects.length; r < length; r++) {
              subjectsCourse.push({
                id: subjects[r]._id,
                valueA: subjects[r].subject.description,
                valueB: subjects[r].teacher.name
              });
            }

            var grid = {
              header: 'Matérias',
              data: subjectsCourse,
              destiny: 'btn-subjects-' + idCourse,
              style: 2
            };

            GridListCtrl.showGrid(grid)
              .then(function (subject) {
                console.log(subject);
                subjectsCourse.length = 0;
              }, function (err) {
                console.error(err);
                subjectsCourse.length = 0;
              });
          }
          else
            messages.alert('Matérias', 'Esse curso não possui matérias.', 'btn-subjects-' + idCourse, 'btn-subjects-' + idCourse);
        };

        vm.showSchedule = function (idCourse, schedules) {

          if (schedules.length > 0 ) {

            $mdDialog.show({
              templateUrl: '../../../templates/gridListSchedule.tpl.html',
              openFrom: '#btn-schedule-' + idCourse,
              closeTo: '#btn-schedule-' + idCourse,
              locals: {
                itemsList: schedules,
                pageHeader: 'Cronograma'
              },
              controller: ['$scope', 'itemsList', 'pageHeader',
                function ($scope, itemsList, pageHeader) {
                  $scope.itemsList = itemsList;
                  $scope.pageHeader = pageHeader;

                  $scope.closeClick = function () {
                    $mdDialog.cancel();
                  };

                  $scope.cancelClick = function () {
                    $mdDialog.cancel();
                  };

                  $scope.confirmClick = function () {
                    $mdDialog.hide();
                  };

                  $scope.itemListClick = function (item) {
                    $mdDialog.hide(item);
                  };

                  $scope.getHour = function (date) {
                    return $filter('date')(date, 'hh:mm');
                  };

                  $scope.getDayDescription = function (day) {
                    switch (day) {
                      case 1:
                        return 'Domingo';
                      case 2:
                        return 'Segunda-Feira';
                      case 3:
                        return 'Terça-Feira';
                      case 4:
                        return 'Quarta-Feira';
                      case 5:
                        return 'Quinta-Feira';
                      case 6:
                        return 'Sexta-Feira';
                      case 7:
                        return 'Sabado';
                    }
                  };

                }],
              controllerAs: 'gcSchedule',
              parent: angular.element(document.body),
              clickOutsideToClose: true,
              fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
            })
              .then(function (day) {
                console.log(day);
              }, function (err) {
                console.error(err);
              });
          }
          else
            messages.alert('Cronograma', 'Esse curso não possui cronograma.', 'btn-schedule-' + idCourse, 'btn-schedule-' + idCourse);
        };

        var formAction = function (action, types) {
          $mdDialog.show({
            templateUrl: '../../../templates/courseForm.tpl.html',
            openFrom: '#bt-action-menu-' + action,
            closeTo: '#grid-courses',
            locals: {
              courseType: types,
              pageHeader: action === 'EDIT' ? 'Alterar Curso' : 'Novo Curso',
              courses: courses,
              action: action,
              Course: courses.Course(),
              id_course: vm.selectedCourseIndex
            },
            controller: ['$scope', 'courseType', 'pageHeader', '$q',
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
              }],
            controllerAs: 'frmCourseCtrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
          })
          .then(function (course) {
              if (action === 'NEW') {
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
              }
              createYearList();

          }, function (err) {
              // TODO: implementar mensagens de erro
          });
        };

        vm.showCollapseButton = function (text) {
          return text.length > 125;
        };

        vm.getShortDescription = function (text) {
          return $filter('limitTo')(text, 125, 0);
        };

        vm.collapseDescription = function (index) {
          if (vm.expandedTextIndex !== index) {
            vm.expandedTextIndex = index;
          }
          else {
            vm.expandedTextIndex = undefined;
          }
        };

        vm.selectCourseIndex = function (index) {
          //active = !active;

          vm.expandedTextIndex = undefined;
          if (vm.selectedCourseIndex !== index) {
            vm.selectedCourseIndex = index;
            vm.undefinedIndex = false;
          }
          else {
            vm.selectedCourseIndex = undefined;
            vm.undefinedIndex = true;
          }
        };
      }]);
}(angular, frontApp));
