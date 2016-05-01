/**
 * Created by jonathan on 01/05/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.teachers.name)
    .controller(frontApp.modules.teachers.controllers.teacherPerson.name, [
      frontApp.modules.teachers.imports.request,
      frontApp.modules.teachers.imports.messages,
      frontApp.modules.teachers.factories.teachers,
      'pageHeader',
      'action',
      'idTeacher',
      '$mdDialog',
      function (request, messages, teachers, pageHeader, action,
                idTeacher, $mdDialog) {
        var self = this;
        var Teachers = teachers.Teacher();
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
            teachers.getTeacher(idTeacher)
              .then(function (student) {
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
          self.errors = [];
          forms.personValidate(self.newPerson)
            .then(function () {
              if (action === 'NEW') {
                var objCourse = new Teachers(self.newPerson);
                objCourse.$post(function (teacher) {
                  if (teacher.success)
                    $mdDialog.hide(teacher.data);
                  else {
                    angular.forEach(teacher.data, function (value) {
                      this.push(value);
                    }, self.errors);
                  }
                });
              }
              else {

                Teachers.put({}, self.newPerson, function (teacher) {
                  if (teacher.success) {
                    $mdDialog.hide(teacher.data);
                  }
                  else {
                    angular.forEach(teacher.data, function (value) {
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
