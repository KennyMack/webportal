/**
 * Created by jonathan on 03/04/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.courses.name)
    .controller(frontApp.modules.courses.controllers.courseSubject.name, [
      frontApp.modules.courses.imports.request,
      frontApp.modules.courses.imports.messages,
      '$routeParams',
      '$mdDialog',
      '$q',
      '$timeout',
      '$filter',
      function (request, messages, $routeParams, $mdDialog, $q, $timeout,$filter) {
        var self = this;
        self.subjects = [];
        self.teachers = [];
        self.error = [];
        self.selectedTeacherItem = null;
        self.selectedSubjectItem = null;
        self.searchTeacherText = null;
        self.searchSubjectText = null;
        self.queryTeacherSearch = queryTeacherSearch;
        self.querySubjectSearch = querySubjectSearch;



        function queryTeacherSearch (query) {
          var results = query ? self.teachers.filter( createFilterForTeacher(query) ) : self.teachers;
          var deferred = $q.defer();
          $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
          return deferred.promise;
        }

        function querySubjectSearch (query) {
          var results = query ? self.subjects.filter( createFilterForSubject(query) ) : self.subjects;
          var deferred = $q.defer();
          $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
          return deferred.promise;
        }

        function createFilterForSubject(query) {
          return function filterFn(subject) {
            return $filter('searchFilter')(query, subject.description) > -1;
          };
        }

        function createFilterForTeacher(query) {
          return function filterFn(teacher) {
            return $filter('searchFilter')(query, teacher.name) > -1;
          };
        }

        self.init = function () {

          request.get(URLS.SUBJECTS(), function (err, data) {
            if(!err) {
              for (var i = 0, length = data.data.length; i < length; i++) {
                self.subjects.push({
                  _id: data.data[i]._id,
                  description: data.data[i].description
                });
              }
              data.data = null;
            }
            else
              messages.alert('Matérias', 'Não foi possível carregar as matérias.');
          });

          request.get(URLS.TEACHERS(), function (err, data) {
            if(!err) {
              for (var i = 0, length = data.data.length; i < length; i++) {
                self.teachers.push({
                  _id: data.data[i]._id,
                  name: data.data[i].name
                });
              }
              data.data = null;
            }
            else
              messages.alert('Professores', 'Não foi possível carregar os professores.');
          });
        };

        self.closeClick = function () {
          $mdDialog.cancel();
        };

        self.cancelClick = function () {
          $mdDialog.cancel();
        };

        self.saveClick = function () {
          self.error = [];
          var subject = {
            teacher: self.selectedTeacherItem._id,
            subject: self.selectedSubjectItem._id
          };

          request.post(URLS.COURSEADDSUBJECT($routeParams.idcourse), subject, function (err, data) {
            if (!err && data.success){
              $mdDialog.hide(data.data);
            }
            else {
              self.error.push(data.data.subject);
            }

          });
        };

      }]);

}(angular, frontApp));
