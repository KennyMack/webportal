/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.students.name)
    .controller(frontApp.modules.students.controllers.students.name, [
      frontApp.modules.students.imports.request,
      frontApp.modules.students.imports.messages,
      frontApp.modules.students.factories.students,
      '$controller',
      '$scope',
      '$filter',
      '$location',
      '$mdDialog',
      '$mdMedia',
      function (request, messages, students,
                $controller, $scope, $filter, $location,
                $mdDialog, $mdMedia) {
        var self = this;
        self.expandedTextIndex = undefined;
        self.undefinedIndex = true;
        self.selectedStudentIndex = undefined;
        self.studentsList = [];
        self.yearsList = [];


        self.init = function () {
          students.getStudents()
            .then(function (students) {
              self.studentsList = [];
              self.yearsList = [];
              self.studentsList = students.data;
              createYearList();
              students.data = null;
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var createYearList = function () {
          self.yearsList = [];
          for (var i = 0, length = self.studentsList.length; i < length; i++) {
            var year = $filter('date')(self.studentsList[i]['create_at'], 'yyyy');
            if (!yearInList(year)) {
              self.yearsList.push({'name': year});
            }
            self.studentsList[i]['year'] = year;
          }
        };

        var yearInList = function (year) {
          return $filter('filter')(self.yearsList, { name: year }).length > 0;
        };

        self.collapseDescription = function (index) {
          if (self.expandedTextIndex !== index) {
            self.expandedTextIndex = index;
          }
          else {
            self.expandedTextIndex = undefined;
          }
        };

        self.selectStudentIndex = function (index) {
          self.expandedTextIndex = undefined;
          if (self.selectedStudentIndex !== index) {
            self.selectedStudentIndex = index;
            self.undefinedIndex = false;
          }
          else {
            self.selectedStudentIndex = undefined;
            self.undefinedIndex = true;
          }
        };

        self.getRandomImage = function (status) {
          if (status === 0)
            return '../images/ic_person_mark4.svg';
          return '../images/ic_person_mark1.svg';
        };

        self.optionClicked = function (index) {

          if(index === 0){
            $location.path(URLS.STUDENTDETAIL(self.selectedStudentIndex));
          }

        };

        // create a new Schedule
        var formAction = function (action) {
          $mdDialog.show({
            templateUrl: frontApp.modules.students.templates.person.url,
            openFrom: '#bt-action-menu-' + action,
            closeTo: '#grid-students',
            controllerAs: frontApp.modules.students.controllers.studentPerson.nameas,
            controller: frontApp.modules.students.controllers.studentPerson.name,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
              pageHeader: action === 'EDIT' ? 'Alterar Aluno' : 'Novo Aluno',
              action: action,
              idStudent: self.selectedStudentIndex
            },
            fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
          })
            .then(function (student) {
              if (action === 'NEW') {
                self.studentsList.push(student);
              }
              else {
                var studentItem = $filter('filter')(self.studentsList, { _id: self.selectedStudentIndex });
                if (studentItem.length > 0){
                    studentItem[0].identify = student.identify ;
                    studentItem[0].name = student.name ;
                    studentItem[0].gender = student.gender ;
                    studentItem[0].dob = new Date(student.dob);
                    studentItem[0].social_number = student.social_number ;
                    studentItem[0].active = student.active;
                }
              }
              createYearList();

            }, function () {
              // TODO: implementar mensagens de erro
            });
        };

        $scope.$on('actionMenu::NEW', function() {
            formAction('NEW');
        });

        $scope.$on('actionMenu::EDIT', function() {
          if (self.selectedStudentIndex != undefined) {
            formAction('EDIT');
          }
          else {
            messages.alert('Edição', 'Selecione um aluno para realizar a edição.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
          }
        });

        $scope.$on('actionMenu::REMOVE', function() {
          if (self.selectedStudentIndex != undefined) {
            messages.confirm('Exclusão', 'Confirma a exclusão do curso ?', 'bt-action-menu-REMOVE', 'grid-courses')
              .then(function () {
                request.delete(URLS.STUDENTS(self.selectedStudentIndex))
                  .then(function (result) {
                    if(result.status === 200 ){
                      var selectedStudent = $filter('filter')(self.studentsList, { _id : self.selectedStudentIndex })[0];
                      self.studentsList.splice(self.studentsList.indexOf(selectedStudent) , 1);

                      createYearList();
                    }
                    else {
                      messages.alert('Exclusão', 'Não foi possível realizar a exclusão.', 'bt-action-menu-REMOVE', 'bt-action-menu-REMOVE');
                    }
                  })
                  .catch(function () {
                    messages.alert('Exclusão', 'Não foi possível realizar a exclusão.', 'bt-action-menu-REMOVE', 'bt-action-menu-REMOVE');
                  });
              },
              function () {

              });
          }
          else {
            messages.alert('Exclusão', 'Selecione um professor para realizar a exclusão.', 'bt-action-menu-REMOVE', 'bt-action-menu-REMOVE');
          }
        });



    }]);
}(angular, frontApp));
