'use strict';
/**
 * Created by jonathan on 10/03/16.
 */


angular.module('app.routes', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/person-type', {
        templateUrl: 'views/personType.html',
        controller: 'personTypeCtrl',
        controllerAs: 'person'
      })
      .when('/courses', {
        templateUrl: 'views/courses.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/students', {
        templateUrl: 'views/students.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/teachers', {
        templateUrl: 'views/teachers.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
