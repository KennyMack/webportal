/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.teachers = {
    name: 'teachers',
    controllers: {
      teachers: {
        name: 'TeachersCtrl',
        nameas: 'teachers'
      }
    },
    routes: {
      teachers: URLS.TEACHERS()
    },
    templates: {
      teachers: {
        url: 'views/teachers.html'
      }
    }
  };
  angular.module(frontApp.modules.teachers.name, [
    'ngRoute'
  ]);

}(angular, frontApp));
