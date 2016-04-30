/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.students.name)
    .controller(frontApp.modules.students.controllers.students.name, [
      frontApp.modules.students.imports.resource,
      frontApp.modules.students.imports.request,
      frontApp.modules.students.imports.messages,
      frontApp.modules.students.factories.students,
      '$controller',
      '$scope',
      '$filter',
      '$location',
      '$mdDialog',
      '$mdMedia',
      function (resource, request, messages, students,
                $controller, $scope, $filter, $location,
                $mdDialog, $mdMedia) {
        var self = this;
        self.expandedTextIndex = undefined;
        self.undefinedIndex = true;
        self.selectedCourseIndex = undefined;
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

        self.selectCourseIndex = function (index) {
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

        self.getRandomImage = function (status) {
          if (status === 0)
            return '../images/ic_person_mark4.svg';
          return '../images/ic_person_mark1.svg';
        };



    }]);
}(angular, frontApp));
