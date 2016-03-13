/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.courses = {
    name: 'courses',
    controllers: {
      courses: {
        name: 'CoursesCtrl',
        nameas: 'courses'
      }
    },
    routes: {
      courses: '/courses'
    },
    templates: {
      courses: {
        url: 'views/courses.html'
      }
    }
  };
  angular.module(frontApp.modules.courses.name, [
    'ngRoute'
  ]);

}(angular, frontApp));
