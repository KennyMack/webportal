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
      '$q',
      function (resource, request, courses, $location, $routeParams, $q) {
        var vm = this;
        vm.course = null;
        vm.schedule = [];

        vm.init = function () {
          console.log($routeParams.idcourse);
          courses.getCourse($routeParams.idcourse)
            .then(function (courses) {
              vm.course = courses.data;
              return listSchedule(vm.course.schedule)
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            })
            .then(function (list) {
              vm.schedule = list;
            });
        };

        function listSchedule(schedules){
          var deferred = $q.defer();

        }

        /*vm.students = [{ value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" },
          { value: 'Jonathan', img:"../images/ic_person.svg", valueA:"Jonathan" }

        ];
        vm.subjects = [
          { value: 'Português', valueA:"Jonathan" },
          { value: 'Português', valueA:"Jonathan" },
          { value: 'Português', valueA:"Jonathan" },
          { value: 'Português', valueA:"Jonathan" },
          { value: 'Português', valueA:"Jonathan" }
        ]*/


      }]);
}(angular, frontApp));
