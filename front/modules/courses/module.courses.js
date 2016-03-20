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
      courses: URLS.COURSES()
    },
    factories: {
      courses: 'coursesFactory'
    },
    templates: {
      courses: {
        url: 'views/courses.html'
      }
    },
    imports: {
      gridlistctrl: frontApp.modules.utils.controllers.GridListCtrl.name,
      messages: frontApp.modules.utils.services.messages,
      request: frontApp.modules.utils.factories.request,
      resource: frontApp.modules.utils.factories.resource
    }
  };
  angular.module(frontApp.modules.courses.name, [
    'ngRoute',
    'ngMaterial'
  ]);

}(angular, frontApp));
