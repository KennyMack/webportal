/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.teachers.name)
    .controller(frontApp.modules.teachers.controllers.teachers.name, [
      frontApp.modules.teachers.imports.request,
      frontApp.modules.teachers.imports.messages,
      frontApp.modules.teachers.factories.teachers,
      '$controller',
      '$scope',
      '$filter',
      '$location',
      '$mdDialog',
      '$mdMedia',
      function (request, messages, teachers,
                $controller, $scope, $filter, $location,
                $mdDialog, $mdMedia) {
        var self = this;
        self.undefinedIndex = true;
        self.selectedTeacherIndex = undefined;
        self.teachersList = [];
        self.yearsList = [];


        self.init = function () {
          teachers.getTeachers()
            .then(function (teacher) {
              self.teachersList = [];
              self.yearsList = [];
              self.teachersList = teacher.data;
              createYearList();
              teachers.data = null;
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var createYearList = function () {
          self.yearsList = [];
          for (var i = 0, length = self.teachersList.length; i < length; i++) {
            var year = $filter('date')(self.teachersList[i]['create_at'], 'yyyy');
            if (!yearInList(year)) {
              self.yearsList.push({'name': year});
            }
            self.teachersList[i]['year'] = year;
          }
        };

        var yearInList = function (year) {
          return $filter('filter')(self.yearsList, { name: year }).length > 0;
        };

        self.selectStudentIndex = function (index) {
          if (self.selectedTeacherIndex !== index) {
            self.selectedTeacherIndex = index;
            self.undefinedIndex = false;
          }
          else {
            self.selectedTeacherIndex = undefined;
            self.undefinedIndex = true;
          }
        };

        self.getRandomImage = function (status) {
          if (status === 0)
            return '../images/ic_person_mark4.svg';
          return '../images/ic_person_mark1.svg';
        };

        // create a new Schedule
        var formAction = function (action) {
          $mdDialog.show({
            templateUrl: frontApp.modules.teachers.templates.person.url,
            openFrom: '#bt-action-menu-' + action,
            closeTo: '#grid-students',
            controllerAs: frontApp.modules.teachers.controllers.teacherPerson.nameas,
            controller: frontApp.modules.teachers.controllers.teacherPerson.name,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
              pageHeader: action === 'EDIT' ? 'Alterar Professor' : 'Novo Professor',
              action: action,
              idTeacher: self.selectedTeacherIndex
            },
            fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
          })
            .then(function (teacher) {
              if (action === 'NEW') {
                self.teachersList.push(teacher);
              }
              else {
                var teacherItem = $filter('filter')(self.teachersList, { _id: self.selectedTeacherIndex });
                if (teacherItem.length > 0){
                  teacherItem[0].identify = teacher.identify ;
                  teacherItem[0].name = teacher.name ;
                  teacherItem[0].gender = teacher.gender ;
                  teacherItem[0].dob = new Date(teacher.dob);
                  teacherItem[0].social_number = teacher.social_number ;
                  teacherItem[0].active = teacher.active;
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
          if (self.selectedTeacherIndex != undefined) {
            formAction('EDIT');
          }
          else {
            messages.alert('Edição', 'Selecione um professor para realizar a edição.', 'bt-action-menu-EDIT', 'bt-action-menu-EDIT');
          }
        });

        $scope.$on('actionMenu::REMOVE', function() {
          if (self.selectedTeacherIndex != undefined) {
            messages.confirm('Exclusão', 'Confirma a exclusão do curso ?', 'bt-action-menu-REMOVE', 'grid-courses')
              .then(function () {
                request.delete(URLS.TEACHERS(self.selectedTeacherIndex))
                  .then(function (result) {
                    if(result.status === 200 ){
                      var selectedTeacher = $filter('filter')(self.teachersList, { _id : self.selectedTeacherIndex })[0];
                      self.teachersList.splice(self.teachersList.indexOf(selectedTeacher) , 1);

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
