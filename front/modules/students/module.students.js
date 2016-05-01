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
      },
      studentPerson: {
        name: 'StudentPersonCtrl',
        nameas: 'PersonCtrl'
      }
    },
    routes: {
      students: URLS.STUDENTS()
    },
    factories: {
      students: 'studentsFactory'
    },
    templates: {
      students: {
        url: 'views/students.html'
      },
      person: {
        url: '../../../templates/personForm.tpl.html'
      }
    },
    imports: {
      gridlistctrl: frontApp.modules.utils.controllers.GridListCtrl.name,
      messages: frontApp.modules.utils.services.messages,
      request: frontApp.modules.utils.factories.request,
      resource: frontApp.modules.utils.factories.resource,
      localSave: frontApp.modules.utils.services.localSave
    }
  };
  angular.module(frontApp.modules.students.name, [
    'ngRoute'
  ]);

}(angular, frontApp));
