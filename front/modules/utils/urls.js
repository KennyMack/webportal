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
    STUDENTS: function () {
        return '/students';
    },
    TEACHERS: function () {
        return '/teachers';
    },
    COURSES: function () {
        return '/courses';
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
