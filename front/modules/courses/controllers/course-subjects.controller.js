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
        self.selectedTeacherItem = null;
        self.selectedSubjectItem = null;
        self.searchTeacherText = null;
        self.searchSubjectText = null;
        self.queryTeacherSearch = queryTeacherSearch;
        self.querySubjectSearch = querySubjectSearch;
        self.error = [];


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
          var lowercaseQuery = $filter('removeAccentsFilter')(angular.lowercase(query));
          return function filterFn(subject) {
            var field = $filter('removeAccentsFilter')(subject.description.toLowerCase());
            return boyermoore.indexOf(lowercaseQuery, field) > -1;
            //return ($filter('removeAccentsFilter')(subject.description.toLowerCase()).indexOf(lowercaseQuery) === 0);
          };
        }

        function createFilterForTeacher(query) {
          var lowercaseQuery = $filter('removeAccentsFilter')(angular.lowercase(query));
          return function filterFn(teacher) {
            return ($filter('removeAccentsFilter')(teacher.name.toLowerCase()).indexOf(lowercaseQuery) === 0);
          };
        }

        var boyermoore ={

          alphabetSize: 256,

          /*
           Returns the index of the first occurence of
           the `needle` buffer within the `haystack` buffer.

           @param {Buffer} needle
           @param {Buffer} haystack
           @return {Integer}
           */
          indexOf: function( needle, haystack ) {

            var i, k;
            var n = needle.length;
            var m = haystack.length;

            if( n === 0 ) return n;

            var charTable = this.makeCharTable( needle );
            var offsetTable = this.makeOffsetTable( needle );

            for( i = n - 1; i < m; ) {
              for( k = n - 1; needle[k] === haystack[i]; --i, --k ) {
                if( k === 0 ) return i;
              }
              // i += n - k; // for naive method
              i += Math.max( offsetTable[ n - 1 - k ], charTable[ haystack[i] ] );
            }

            return -1;

          },

          /*
           Makes the jump table based on the
           mismatched character information.

           @param {Buffer} needle
           @return {Buffer}
           */
          makeCharTable: function( needle ) {

            var table = new Uint32Array( this.alphabetSize );
            var n = needle.length;
            var t = table.length;
            var i = 0;

            for( ; i < t; ++i ) {
              table[i] = n;
            }

            n--;

            for( i = 0; i < n; ++i ) {
              table[ needle[i] ] = n - i;
            }

            return table;

          },

          /*
           Makes the jump table based on the
           scan offset which mismatch occurs.

           @param {Buffer} needle
           */
          makeOffsetTable: function( needle ) {

            var i, suffix;
            var n = needle.length;
            var m = n - 1;
            var lastPrefix = n;
            var table = new Uint32Array( n );

            for( i = m; i >= 0; --i ) {
              if( this.isPrefix( needle, i + 1 ) ) {
                lastPrefix = i + 1;
              }
              table[ m - i ] = lastPrefix - i + m;
            }

            for( i = 0; i < n; ++i ) {
              suffix = this.suffixLength( needle, i );
              table[ suffix ] = m - i + suffix;
            }

            return table;

          },

          /*
           Is `needle[i:end]` a prefix of `needle`?

           @param {Buffer} needle
           @param {Integer} i
           */
          isPrefix: function( needle, i ) {

            var k = 0;
            var n = needle.length;

            for( ; i < n; ++i, ++k ) {
              if( needle[i] !== needle[k] ) {
                return false;
              }
            }

            return true;

          },

          /*
           Returns the maximum length of the
           substring ends at `i` and is a suffix.

           @param {Buffer} needle
           @param {Integer} i
           */
          suffixLength: function( needle, i ) {

            var k = 0;
            var n = needle.length;
            var m = n - 1;

            for( ; i >= 0 && needle[i] === needle[m]; --i, --m ) {
              k += 1;
            }

            return k;

          }

        };

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
