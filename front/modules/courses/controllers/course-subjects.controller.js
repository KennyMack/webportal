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
      '$scope',
      function (request, messages, $routeParams, $mdDialog, $q, $timeout,$filter, $scope) {
        var self = this;
        var blurTeacher = false;
        var blurSubject = false;
        var loadSubject = false;
        var loadTeacher = false;
        var initializing = false;
        var idCourse = $routeParams.idcourse;
        self.subjects = [];
        self.teachers = [];
        self.error = [];
        self.selectedTeacherItem = null;
        self.selectedSubjectItem = null;
        self.searchTeacherText = null;
        self.searchSubjectText = null;
        self.queryTeacherSearch = queryTeacherSearch;
        self.querySubjectSearch = querySubjectSearch;
        self.isTeacherTextValid = true;
        self.isSubjectTextValid = true;

        self.logTeacher = function(){
          blurTeacher = true;
          self.isTeacherTextValid = validate(self.searchTeacherText, blurTeacher);
        };

        self.logSubject = function(){
          blurSubject = true;
          self.isSubjectTextValid = validate(self.searchSubjectText, blurSubject);
        };

        function validate(value, blur){
          return !((!initializing) &&
          (value === undefined || value === "" || value === null) &&
          (blur));
        }

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
          initializing = true;

          $q.all({
            subjects: request.get(URLS.SUBJECTS()),
            teachers: request.get(URLS.TEACHERS())
          }).then(function(results) {
            loadSubjects(results.subjects);
            loadTeachers(results.teachers);
          });
/*
          initializing = true;
          request.get(URLS.SUBJECTS())
            .then(function (result) {
              if(!result.err) {
                for (var i = 0, length = result.data.length; i < length; i++) {
                  self.subjects.push({
                    _id: result.data[i]._id,
                    description: result.data[i].description
                  });
                }
                result.data = null;
              }
              else
                messages.alert('Matérias', 'Não foi possível carregar as matérias.');
            })
            .catch(function () {
              messages.alert('Matérias', 'Não foi possível carregar as matérias.');
            });

          request.get(URLS.TEACHERS())
            .then(function (result) {
              initializing = false;
              if(!result.err) {
                for (var i = 0, length = result.data.length; i < length; i++) {
                  self.teachers.push({
                    _id: result.data[i]._id,
                    name: result.data[i].name
                  });
                }
                result.data = null;
              }
              else
                messages.alert('Professores', 'Não foi possível carregar os professores.');
            })
            .catch(function () {
              messages.alert('Professores', 'Não foi possível carregar os professores.');
            })*/
        };

        var loadSubjects = function (result) {

          if(!result.err) {
            var subjects = result.data;
            for (var i = 0, length = subjects.length; i < length; i++) {
              self.subjects.push({
                _id: subjects[i]._id,
                description: subjects[i].description
              });
            }
          }
          else
            messages.alert('Matérias', 'Não foi possível carregar as matérias.');

          loadSubject = true;
          initializing = !(loadSubject && loadTeacher);
        };

        var loadTeachers = function (result) {
          if (!result.err) {
            var teachers = result.data;
            for (var i = 0, length = teachers.length; i < length; i++) {
              self.teachers.push({
                _id: teachers[i]._id,
                name: teachers[i].name
              });
            }
          }
          else
            messages.alert('Professores', 'Não foi possível carregar os professores.');

          loadTeacher = true;
          initializing = !(loadSubject && loadTeacher);
        };

        self.closeClick = function () {
          $mdDialog.cancel();
        };

        self.cancelClick = function () {
          $mdDialog.cancel();
        };

        self.saveClick = function () {
          self.error = [];
          if(self.selectedSubjectItem == null) {
            self.error.push('Selecione a Matéria.');
          }
          if (self.selectedTeacherItem  == null){
            self.error.push('Selecione o Professor.');
          }
          if (self.selectedTeacherItem != null && self.selectedSubjectItem != null){

            var subject = {
              teacher: self.selectedTeacherItem._id || '',
              subject: self.selectedSubjectItem._id || ''
            };

            request.post(URLS.COURSEADDSUBJECT(idCourse), subject)
              .then(function (result) {
                if (result.success) {
                  $mdDialog.hide(result.data);
                }
                else {
                  self.error.push(result.data.subject);
                }
              })
              .catch(function (err) {

                if (err.data.subject)
                  self.error.push(err.data.subject);
                else
                  self.error.push('Ocorreu um erro ao salvar a matéria.');
              });
          }
        };

      }]);

}(angular, frontApp));
