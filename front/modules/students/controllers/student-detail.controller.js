/**
 * Created by jonathan on 01/05/16.
 */

(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.students.name)
    .controller(frontApp.modules.students.controllers.studentDetail.name, [
      frontApp.modules.students.imports.resource,
      frontApp.modules.students.imports.request,
      frontApp.modules.students.factories.students,
      frontApp.modules.students.imports.messages,
      '$location',
      '$routeParams',
      '$filter',
      '$scope',
      '$mdDialog',
      '$mdMedia',
      function (resource, request, students, messages, $location,
                $routeParams, $filter, $scope,
                $mdDialog, $mdMedia) {
        var self = this;
        self.student = null;
        self.schedule = [];
        self.subjects = [];
        var idStudent = $routeParams.idstudent;

        // initializes view controllers
        self.init = function () {
          console.log('init');
          students.getStudent(idStudent)
            .then(function (student) {
              self.student = student.data;
              console.log(student);
              student.data = null;
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

      }]);
}(angular, frontApp));
