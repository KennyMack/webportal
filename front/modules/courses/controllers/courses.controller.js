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
        var self = this;
        var GridListCtrl = $controller(frontApp.modules.courses.imports.gridlistctrl, { $scope: $scope });
        var active = true;
        self.expandedTextIndex = undefined;
        self.undefinedIndex = true;
        self.selectedCourseIndex = undefined;
        self.courseslist = [];
        self.yearsList = [];

        $scope.$on('actionMenu::NEW', function() {
          request.get(URLS.COURSETYPE())
            .then(function (result) {
                if (result.success)
                  formAction('NEW', result.data);
                else
                  messages.alert('Tipo de curso', 'Não foi possível carregar os tipos de cursos.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
            })
            .catch(function () {
              messages.alert('Tipo de curso', 'Não foi possível carregar os tipos de cursos.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
            });

        });

        self.editCourse = function (id) {
          self.selectedCourseIndex = id;
          callEdit();
        };

        self.editCourse = function (id, course) {
          self.selectedCourseIndex = id;
          callEdit(course);
        };

        function callEdit(course){
          request.get(URLS.COURSETYPE())
            .then(function (result) {
              if (result.success)
                formAction('EDIT', result.data, course);
              else
                messages.alert('Tipo de curso', 'Não foi possível carregar os tipos de cursos.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
            })
            .catch(function () {
              messages.alert('Tipo de curso', 'Não foi possível carregar os tipos de cursos.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
            });
        }

        $scope.$on('actionMenu::EDIT', function() {
          if (self.selectedCourseIndex != undefined) {
            callEdit();
          }
          else {
            messages.alert('Edição', 'Selecione um curso para realizar a edição.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
          }
        });

        $scope.$on('actionMenu::REMOVE', function() {
          self.removeCourse();
        });

        self.removeCourse = function (id) {
          //self.selectedCourseIndex = id;
          callRemove();
        };

        self.menuActionsCard = function (index) {
          if (self.selectedCourseIndex === index) {
            active = !active;
          }
        };

        self.optionClicked = function (index) {

          if(index === 0){
            $location.path(URLS.COURSEDETAIL(self.selectedCourseIndex));
          }

        };

        function callRemove() {
          if (self.selectedCourseIndex != undefined) {
            messages.confirm('Exclusão', 'Confirma a exclusão do curso ?', 'bt-action-menu-REMOVE', 'grid-courses')
              .then(function () {
                request.delete(URLS.COURSES(self.selectedCourseIndex))
                  .then(function (result) {
                    if(result.status === 200 ){
                      var selectedCourse = $filter('filter')(self.courseslist, { _id : self.selectedCourseIndex })[0];
                      self.courseslist.splice(self.courseslist.indexOf(selectedCourse) , 1);

                      createYearList();
                    }
                    else {
                      messages.alert('Curso', 'Não foi possível realizar a exclusão.', 'bt-action-menu-REMOVE', 'bt-action-menu-REMOVE');
                    }
                  })
                  .catch(function () {
                    messages.alert('Curso', 'Não foi possível realizar a exclusão.', 'bt-action-menu-REMOVE', 'bt-action-menu-REMOVE');
                  });
              },
              function () {

              });
          }
          else {
            messages.alert('Exclusão', 'Selecione um curso para realizar a exclusão.', 'bt-action-menu-REMOVE', 'bt-action-menu-REMOVE');
          }
        }

        self.init = function () {
          $scope.$broadcast('actionMenu::SHOWBUTTON');
          courses.getCourses()
            .then(function (courses) {
              self.courseslist = [];
              self.yearsList = [];
              self.courseslist = courses.data;
              createYearList();
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var createYearList = function () {
          self.yearsList = [];
          for (var i = 0, length = self.courseslist.length; i < length; i++) {
            var year = $filter('date')(self.courseslist[i]['duration']['start'], 'yyyy');
            if (!yearInList(year)) {
              self.yearsList.push({'name': year});
            }
            self.courseslist[i]['year'] = year;
          }
        };

        var yearInList = function (year) {
          return $filter('filter')(self.yearsList, { name: year }).length > 0;
        };

        self.showClass = function (idCourse, students) {
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
              .then(function () {
                studentsClass.length = 0;
              }, function () {
                studentsClass.length = 0;
              });
          }
          else
            messages.alert('Alunos', 'Esse curso não possui alunos.', 'btn-class-' + idCourse, 'btn-class-' + idCourse);
        };

        self.showSubjects = function (idCourse, subjects) {
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
              .then(function () {
                subjectsCourse.length = 0;
              }, function () {
                subjectsCourse.length = 0;
              });
          }
          else
            messages.alert('Matérias', 'Esse curso não possui matérias.', 'btn-subjects-' + idCourse, 'btn-subjects-' + idCourse);
        };

        self.showSchedule = function (idCourse, subjects) {

          if (subjects.length > 0 ) {

            var schedule = [];
            for (var i = 0, lenSubject = subjects.length; i < lenSubject; i++) {
              for (var r = 0, lenSchedule = subjects[i].schedule.length; r < lenSchedule; r++) {
                var item = {
                  _id: subjects[i].schedule[r]['_id'],
                  day_num: subjects[i].schedule[r]['day'],
                  day: DAYS.DAY_DESCRIPTION(subjects[i].schedule[r]['day']),
                  subject: {
                    description: subjects[i]['subject']['description'],
                    _id: subjects[i]['subject']['_id']
                  },
                  duration: {
                    start: $filter('date')(subjects[i].schedule[r]['duration']['start'], 'HH:mm'),
                    end: $filter('date')(subjects[i].schedule[r]['duration']['end'], 'HH:mm')
                  },
                  teacher: subjects[i]['teacher']['name']
                };
                schedule.push(item);
              }
            }
            schedule = $filter('orderBy')(schedule, 'day_num');

            $mdDialog.show({
              templateUrl: '../../../templates/gridListSchedule.tpl.html',
              openFrom: '#btn-schedule-' + idCourse,
              closeTo: '#btn-schedule-' + idCourse,
              locals: {
                itemsList: schedule,
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
              .then(function () {
              }, function () {
              });
          }
          else
            messages.alert('Cronograma', 'Esse curso não possui cronograma.', 'btn-schedule-' + idCourse, 'btn-schedule-' + idCourse);
        };

        var formAction = function (action, types, pcourse) {
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
              id_course: self.selectedCourseIndex
            },
            controller: ['$scope', 'courseType', 'pageHeader', '$q',
              'courses', 'action', 'Course', 'id_course',
              function ($scope, courseType, pageHeader, $q,
                        courses, action, Course, id_course) {
                var self = this;
                self.newCourse = {
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

                self.init = function () {
                  if (action !== 'NEW') {
                    Course.get({Id: id_course}, function (course) {
                      self.newCourse = {
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

                self.courseType = courseType;
                self.pageHeader = pageHeader;

                self.closeClick = function () {
                  $mdDialog.cancel();
                };

                self.cancelClick = function () {
                  $mdDialog.cancel();
                };

                self.saveClick = function () {
                  //TODO: Construir a validacao antes de inserir
                  self.newCourse.course_type.description = document.getElementById('cbe-course-type').innerText;
                  self.newCourse.duration.start = moment(self.newCourse.duration.start)._d;
                  self.newCourse.duration.end = moment(self.newCourse.duration.end)._d;

                  if (action === 'NEW') {
                    var objCourse = new Course(self.newCourse);
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

                    Course.put({}, self.newCourse, function (course) {
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
                self.courseslist.push(course);
              }
              else {
                if (pcourse == undefined) {
                  var foundCourse = $filter('filter')(self.courseslist, {_id: self.selectedCourseIndex});
                  if (foundCourse.length > 0) {
                    foundCourse[0].name = course.name;
                    foundCourse[0].identify = course.identify;
                    foundCourse[0].description = course.description;
                    foundCourse[0].active = course.active;
                    foundCourse[0].course_type._id = course.course_type._id;
                    foundCourse[0].course_type.description = course.course_type.description;
                    foundCourse[0].duration.start = Date.parse(course.duration.start);
                    foundCourse[0].duration.end = Date.parse(course.duration.end);
                  }
                }
                else {
                  pcourse.name = course.name;
                  pcourse.identify = course.identify;
                  pcourse.description = course.description;
                  pcourse.active = course.active;
                  pcourse.course_type._id = course.course_type._id;
                  pcourse.course_type.description = course.course_type.description;
                  pcourse.duration.start = course.duration.start;
                  pcourse.duration.end = course.duration.end;
                }

              }
              if (pcourse == undefined)
                createYearList();

          }, function (err) {
              // TODO: implementar mensagens de erro
          });
        };

        self.showCollapseButton = function (text) {
          return text.length > 125;
        };

        self.getShortDescription = function (text) {
          return $filter('limitTo')(text, 125, 0);
        };

        self.collapseDescription = function (index) {
          if (self.expandedTextIndex !== index) {
            self.expandedTextIndex = index;
          }
          else {
            self.expandedTextIndex = undefined;
          }
        };

        self.selectCourseIndex = function (index) {
          //active = !active;

          self.expandedTextIndex = undefined;
          if (self.selectedCourseIndex !== index) {
            self.selectedCourseIndex = index;
            self.undefinedIndex = false;
          }
          else {
            self.selectedCourseIndex = undefined;
            self.undefinedIndex = true;
          }
        };
      }]);
}(angular, frontApp));
