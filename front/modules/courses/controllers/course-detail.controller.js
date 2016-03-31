/**
 * Created by jonathan on 25/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courseDetail.name, [
      frontApp.modules.courses.imports.resource,
      frontApp.modules.courses.imports.request,
      frontApp.modules.courses.factories.courses,
      '$location',
      '$routeParams',
      '$filter',
      '$scope',
      function (resource, request, courses, $location, $routeParams, $filter, $scope) {
        var vm = this;
        vm.course = null;
        vm.schedule = [];

        vm.init = function () {
          $scope.$broadcast('actionMenu::HIDEBUTTON');
          courses.getCourse($routeParams.idcourse)
            .then(function (courses) {
              vm.course = courses.data;
              for (var i = 0, length = courses.data.schedule.length; i < length; i++) {
                vm.schedule.push({
                  _id: courses.data.schedule[i]['_id'],
                  day_num: courses.data.schedule[i]['day'],
                  day: DAYS.DAY_DESCRIPTION(courses.data.schedule[i]['day']),
                  subject: courses.data.schedule[i]['subject']['description'],
                  duration: {
                    start: $filter('date')(courses.data.schedule[i]['duration']['start'], 'HH:mm'),
                    end: $filter('date')(courses.data.schedule[i]['duration']['end'], 'HH:mm')
                  },
                  teacher: getTeacher(courses.data.schedule[i]['subject']['_id'])
                });
              }
              vm.schedule = $filter('orderBy')(vm.schedule, 'day_num');
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var getTeacher = function (id) {
          try {
            console.log(id);
            return $filter('filter')(vm.course.subjects,{ subject: {_id: id}})[0].teacher.name;
          }
          catch(ex) {
            return 'a';
          }
        };
      }]);
}(angular, frontApp));
