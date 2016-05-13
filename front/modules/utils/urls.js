/**
 * Created by jonathan on 13/03/16.
 */
var URLS = (function () {
  'use strict';
  return {
    HOME: function () {
        return '/';
    },
    MORDOR: {
      AUTHENTICATE: function () {
        return '/mordor/authenticate';
      },
      CREDENTIAL: function () {
        return '/mordor/credential';
      }
    },
    STUDENTS: function (code) {
      if (code)
        return '/students/' + code;
      else
        return '/students';
    },
    STUDENTDETAIL: function (code) {
      if (code)
        return '/student-detail/' + code;
      else
        return '/student-detail';
    },
    SUBJECTS: function (code) {
      if (code)
        return '/subjects/' + code;
      else
        return '/subjects';
    },
    TEACHERS: function (code) {
      if (code)
        return '/teachers/' + code;
      else
        return '/teachers';
    },
    TEACHERDETAIL: function (code) {
      if (code)
        return '/teacher-detail/' + code;
      else
        return '/teacher-detail';
    },
    COURSES: function (code) {
      if (code)
        return '/courses/' + code;
      else
        return '/courses';
    },
    COURSEDETAIL: function (code) {
      if (code)
        return '/course-detail/' + code;
      else
        return '/course-detail';
    },
    COURSESUBJECTS: function (idCourse){
      return '/courses/' + idCourse + '/subjects';
    },
    COURSEADDSUBJECT: function (idCourse) {
      return '/courses/' + idCourse + '/add-subject';
    },
    COURSEREMOVESUBJECT: function (idCourse, idsubject) {
      return '/courses/' + idCourse + '/remove-subject/' + idsubject;
    },
    COURSEADDSCHEDULE: function (idCourse) {
      return '/courses/' + idCourse + '/add-schedule';
    },
    COURSEREMOVESCHEDULE: function (idCourse, idSubject, idSchedule) {
      ////courses/          :id/       remove-schedule/:idsubject/item/:idschedule/
      return '/courses/' + idCourse + '/remove-schedule/' + idSubject + '/item/' + idSchedule;
    },
    COURSETYPE: function () {
      return '/course-type';
    },
    USERS: function () {
        return '/users';
    },
    ACCOUNT: function () {
        return '/account';
    },
    LOGIN: function () {
        return '/login';
    },
    PERSONTYPE: function () {
      return '/person-type';
    },
    NOTAUTHORIZED: function () {
      return '/not-authorized';
    },
    SERVERERROR: function (code) {
      if (code)
        return '/server-error/' + code;
      else
        return '/server-error/:errorCode';
    },
    NOTFOUND: function () {
      return '/not-found';
    }
  }
})();
