/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.students.name)
    .config(
    function ($routeProvider) {
      $routeProvider
        .when(frontApp.modules.students.routes.students, {
          controller:  frontApp.modules.students.controllers.students.name,
          controllerAs:  frontApp.modules.students.controllers.students.nameas,
          templateUrl: frontApp.modules.students.templates.students.url,
          access: {
            requiresLogin: true,
            requiredPermissions: ['manager', 'master', 'teacher'],
            permissionType: 'AtLeastOne'
          }
        })
        .when(frontApp.modules.students.routes.studentDetail, {
          controller:  frontApp.modules.students.controllers.studentDetail.name,
          controllerAs:  frontApp.modules.students.controllers.studentDetail.nameas,
          templateUrl: frontApp.modules.students.templates.studentsDetail.url,
          showButton: false,
          access: {
            requiresLogin: true,

          }
        })

    });

}(angular, frontApp));
