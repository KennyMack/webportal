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
      studentDetail: {
        name: 'StudentDetailCtrl',
        nameas: 'studentDetail'
      },
      studentPerson: {
        name: 'StudentPersonCtrl',
        nameas: 'PersonCtrl'
      }
    },
    routes: {
      students: URLS.STUDENTS(),
      studentDetail: URLS.STUDENTDETAIL(':idstudent')
    },
    factories: {
      students: 'studentsFactory'
    },
    templates: {
      students: {
        url: 'views/students.html'
      },
      studentsDetail: {
        url: 'views/student-detail.html'
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
