/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courses.name, [
      frontApp.modules.courses.imports.resource,
      frontApp.modules.courses.imports.messages,
      frontApp.modules.courses.factories.courses,
      '$controller',
      '$scope',
      '$filter',
      '$location',
      '$mdDialog',
      '$mdMedia',
      function (resource, messages, courses, $controller,
                $scope, $filter, $location,
                $mdDialog, $mdMedia) {
        var vm = this;
        var GridListCtrl = $controller(frontApp.modules.courses.imports.gridlistctrl, {$scope: $scope});

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

        vm.selectUserIndex = function (index) {
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
