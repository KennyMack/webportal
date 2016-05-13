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
      },
      teacherDetail: {
        name: 'TeacherDetailCtrl',
        nameas: 'TeacherDetail'
      },
      teacherPerson: {
        name: 'TeacherPersonCtrl',
        nameas: 'PersonCtrl'
      }
    },
    routes: {
      teachers: URLS.TEACHERS(),
      studentDetail: URLS.STUDENTDETAIL(':idstudent')
    },
    factories: {
      teachers: 'teachersFactory'
    },
    templates: {
      teachers: {
        url: 'views/teachers.html'
      },
      person: {
        url: '../../../templates/personForm.tpl.html'
      },
      teacherDetail: {
        url: 'views/teacher-detail.html'
      }
    },
    imports: {
      messages: frontApp.modules.utils.services.messages,
      request: frontApp.modules.utils.factories.request,
      localSave: frontApp.modules.utils.services.localSave
    }
  };
  angular.module(frontApp.modules.teachers.name, [
    'ngRoute'
  ]);

}(angular, frontApp));
