/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.teachers.name)
    .config(
    function ($routeProvider) {
      $routeProvider
        .when(frontApp.modules.teachers.routes.teachers, {
          controller:  frontApp.modules.teachers.controllers.teachers.name,
          controllerAs:  frontApp.modules.teachers.controllers.teachers.nameas,
          templateUrl: frontApp.modules.teachers.templates.teachers.url,
          access: {
            requiresLogin: true,
            requiredPermissions: ['manager', 'master'],
            permissionType: 'AtLeastOne'
          }
        })
        .when(frontApp.modules.teachers.routes.teacherDetail, {
          controller:  frontApp.modules.teachers.controllers.teacherDetail.name,
          controllerAs:  frontApp.modules.teachers.controllers.teacherDetail.nameas,
          templateUrl: frontApp.modules.teachers.templates.teacherDetail.url,
          showButton: false,
          access: {
            requiresLogin: true,
            requiredPermissions: ['manager', 'master', 'teacher'],
            permissionType: 'AtLeastOne'
          }
        })
    });

}(angular, frontApp));
