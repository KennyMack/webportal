/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.students = {
    name: 'students',
    controllers: {
      students: {
        name: 'StudentsCtrl',
        nameas: 'students'
      }
    },
    routes: {
      students: '/students'
    },
    templates: {
      students: {
        url: 'views/students.html'
      }
    }
  };
  angular.module(frontApp.modules.students.name, [
    'ngRoute'
  ]);

}(angular, frontApp));
