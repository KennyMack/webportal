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
        $scope.$on('actionMenu::NEW', function() {
          console.log('NEW');
          request.get(URLS.COURSETYPE(),
            function (err, data) {
              if(!err) {
                console.log(data);
                formAction('NEW', data.data);
              }
              else
                messages.alert('Cronograma', 'Não foi possível carregar os tipos de cursos.', '#bt-action-menu-NEW', '#bt-action-menu-NEW');
            })

        });
        $scope.$on('actionMenu::EDIT', function() {
          console.log('EDIT');
          formAction('EDIT');
        });

        $scope.$on('actionMenu::REMOVE', function() {
          vm.removeCourse();
        });

        vm.removeCourse = function () {
          if (vm.selectedCourseIndex != undefined) {
            messages.confirm('Exclusão', 'Confirma a exclusão do curso ?', 'bt-action-menu-REMOVE', 'bt-action-menu-REMOVE')
              .then(function () {
                request.delete(URLS.COURSES(vm.selectedCourseIndex),
                  function (err, data, status) {
                    if(!err && status === 200 ){
                      for (var i = 0, length = vm.courseslist.length; i < length; i++) {
                        if (vm.courseslist[i]._id === vm.selectedCourseIndex){
                          vm.courseslist.splice(i, 1);
                        }

                      }
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

        vm.expandedTextIndex = undefined;
        vm.undefinedIndex = true;
        vm.selectedCourseIndex = undefined;


        vm.courseslist = [];
        vm.yearsList = [];

        vm.init = function () {
          courses.getCourses()
            .then(function (courses) {
              vm.courseslist = [];
              vm.yearsList = [];

              for (var i = 0, length = courses.data.length; i < length; i++) {

                var year = $filter('date')(courses.data[i]['create_at'], 'yyyy');
                if (!yearInList(year)) {
                  vm.yearsList.push({'name': year});
                }
                courses.data[i]['year'] = year;
              }

              vm.courseslist = courses.data;
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var yearInList = function (year) {
          for (var i = 0, length = vm.yearsList.length; i < length; i++) {
            if (year == vm.yearsList[i]['name'])
              return true;
          }
          return false;
        };

        vm.getCoursesYear = function (year) {
          return $filter('filter')(vm.courseslist, {year: year});
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
            closeTo: '#bt-action-menu-' + action,
            locals: {
              courseType: types,
              pageHeader: 'Novo Curso',
              courses: courses,
              Course: courses.Course()
            },
            controller: ['$scope', 'courseType', 'pageHeader', '$q', 'courses', 'Course',
              function ($scope, courseType, pageHeader, $q, courses, Course) {
                var vm = this;

                /*var c = new Course();

                c.name = 'Curso teste';
                c.identify = '000255';
                c.description = 'Curso testeasasd sda sd';
                c.active = '1';
                c.course_type = {
                  _id : '56db93aa3a8281116f5802e4',
                  description : 'Curso de verão'
                };
                c.duration = {
                  start: new Date(),
                  end: new Date()
                };


                c.$post();*/

                Course.get({Id:'56ef8dde823d25863ebe8997'}, function(user, getResponseHeaders){
                  console.log(user);
                  user.data.name = 'Curso Novo Teste 3';
                  new Course(user.data).$put(function(user, putResponseHeaders) {
                    //user => saved user object
                    //putResponseHeaders => $http header getter
                  });
                  console.log(getResponseHeaders);
                });


                //console.log(c);
                vm.courseType = courseType;
                vm.pageHeader = pageHeader;
                vm.duration = {
                  start:new Date(), //$filter('date')(Date.now(), 'dd/mm/yyyy'),
                  end: new Date()//$filter('date')(Date.now(), 'dd/mm/yyyy')
                };

                vm.closeClick = function () {
                  $mdDialog.cancel();
                };

                vm.cancelClick = function () {
                  $mdDialog.cancel();
                };

                vm.saveClick = function () {
                  console.log(self.selectedItem);
                  //$mdDialog.hide();
                };

              }],
            controllerAs: 'frmCourseCtrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
          })
            .then(function (day) {
              console.log(day);
            }, function (err) {
              console.error(err);
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
