/**
 * Created by jonathan on 30/04/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.students.name)
    .controller(frontApp.modules.students.controllers.studentPerson.name, [
      frontApp.modules.students.imports.request,
      frontApp.modules.students.imports.messages,
      frontApp.modules.students.factories.students,
      'pageHeader',
      'action',
      'idStudent',
      '$mdDialog',
      function (request, messages, students, pageHeader, action,
                idStudent, $mdDialog) {
        var self = this;
        var Student = students.Student();
        self.errors = [];
        self.pageHeader = pageHeader;
        self.genders = [
          {
            code: 'F',
            description: GENDER.GENDER_DESCRIPTION('F')
          },
          {
            code: 'M',
            description: GENDER.GENDER_DESCRIPTION('M')
          },
          {
            code: '',
            description: GENDER.GENDER_DESCRIPTION('')
          }
        ];

        self.newPerson = {
          _id : '',
          identify : '',
          name : '',
          gender : '',
          dob : new Date(),
          social_number : '',
          active : '1',
          address : [],
          emails : [],
          phone : []
        };


        self.init = function () {
          if (action !== 'NEW') {
            Student.get({Id: idStudent}, function (student) {
              self.newPerson = {
                _id : student.data._id,
                identify : student.data.identify ,
                name : student.data.name ,
                gender : student.data.gender ,
                dob : new Date(student.data.dob),
                social_number : student.data.social_number ,
                active : student.data.active.toString(),
                address : [],
                emails : [],
                phone : []
              };
            });
          }
        };

        self.getDayDescription = function (day) {
          return DAYS.DAY_DESCRIPTION(day);
        };

        self.closeClick = function () {
          $mdDialog.cancel();
        };

        self.cancelClick = function () {
          $mdDialog.cancel();
        };

        self.saveClick = function () {
          //TODO: Construir a validacao antes de inserir
          self.errors = [];

          forms.personValidate(self.newPerson)
            .then(function () {
              if (action === 'NEW') {
                var objCourse = new Student(self.newPerson);
                objCourse.$post(function (student) {
                  if (student.success)
                    $mdDialog.hide(student.data);
                  else {
                    angular.forEach(student.data, function (value) {
                      this.push(value);
                    }, self.errors);
                  }
                });
              }
              else {

                Student.put({}, self.newPerson, function (student) {
                  if (student.success) {
                    $mdDialog.hide(student.data);
                  }
                  else {
                    angular.forEach(student.data, function (value) {
                      this.push(value);
                    }, self.errors);
                  }
                });
              }

            })
            .catch(function (err) {
              angular.forEach(err, function (value) {
                this.push(value);
              }, self.errors);
            });


        };

      }]);
}(angular, frontApp));
