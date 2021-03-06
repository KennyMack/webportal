/**
 * Created by jonathan on 06/05/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.students.name)
    .controller(frontApp.modules.teachers.controllers.teacherDetail.name, [
      frontApp.modules.teachers.imports.resource,
      frontApp.modules.teachers.imports.request,
      frontApp.modules.teachers.factories.teachers,
      frontApp.modules.teachers.imports.messages,
      '$location',
      '$routeParams',
      '$filter',
      '$scope',
      '$mdDialog',
      '$mdMedia',
      function (resource, request, teachers, messages, $location,
                $routeParams, $filter, $scope,
                $mdDialog, $mdMedia) {
        var self = this;
        self.undefinedIndex = true;
        self.selectedCourseIndex = undefined;
        self.teacher = null;
        self.schedule = [];
        self.subjects = [];
        self.yearsList = [];
        self.courseslist = [];
        var idStudent = $routeParams.idstudent;

        // initializes view controllers
        self.init = function () {
          console.log('init');
          teachers.getStudent(idStudent)
            .then(function (student) {
              self.courseslist = [];

              self.teacher = student.data;
              createCourseList(self.teacher.courses);
              createYearList();
              student.data = null;
            },
            function () {
              $location.path(URLS.SERVERERROR(500));
            });
        };

        var createCourseList = function (courses) {
          self.courseslist = [];
          for (var i = 0, length = courses.length; i < length; i++) {
            self.courseslist.push({
              _id: courses[i]._id._id,
              identify: courses[i]._id.identify,
              name: courses[i]._id.name,
              description: courses[i]._id.description,
              active: courses[i]._id.active,
              subjects: courses[i]._id.subjects,
              course_type: courses[i]._id.course_type,
              duration: courses[i]._id.duration,
              year:$filter('date')(courses[i]._id['duration']['start'], 'yyyy'),
              student_duration: {
                start: courses[i].student_duration,
                end: moment()
              },
              student_active: courses[i].student_active
            });

            loadSubjects(courses[i]._id.subjects, courses[i]._id._id);
            loadSchedules(courses[i]._id.subjects, courses[i]._id._id);
          }
        };

        // Load local subjects
        var loadSubjects = function (subjects, id) {
          self.subjects = [];
          // through all the subjects of course
          for (var i = 0, lenSubject = subjects.length; i < lenSubject; i++) {

            self.subjects.push({
              course_id: id,
              _id: subjects[i]._id,
              subject: subjects[i].subject,
              teacher: subjects[i].teacher
            });
          }

        };

        // Load local Schedules
        var loadSchedules = function (schedules, id) {
          self.schedule = [];

          // through all the subjects of course
          for (var i = 0, lenSubject = schedules.length; i < lenSubject; i++) {

            // through all the schedules of subject
            for (var r = 0, lenSchedule = schedules[i].schedule.length; r < lenSchedule; r++) {
              // create a item schedule
              var item = {
                course_id: id,
                _id: schedules[i].schedule[r]['_id'],
                day_num: schedules[i].schedule[r]['day'],
                day: DAYS.DAY_DESCRIPTION(schedules[i].schedule[r]['day']),
                subject: {
                  description: schedules[i]['subject']['description'],
                  _id: schedules[i]['subject']['_id']
                },
                duration: {
                  start: $filter('date')(schedules[i].schedule[r]['duration']['start'], 'HH:mm'),
                  end: $filter('date')(schedules[i].schedule[r]['duration']['end'], 'HH:mm')
                },
                teacher: schedules[i]['teacher']['name']
              };
              // add schedule to local schedules
              self.schedule.push(item);
            }
          }
          // ordenying schedules by day
          self.schedule = $filter('orderBy')(self.schedule, 'day_num');
        };

        var createYearList = function () {
          self.yearsList = [];
          for (var i = 0, length = self.courseslist.length; i < length; i++) {
            var year = $filter('date')(self.courseslist[i]['duration']['start'], 'yyyy');
            if (!yearInList(year)) {
              self.yearsList.push({'name': year});
            }
            //self.courseslist[i]['year'] = year;
          }
        };

        var yearInList = function (year) {
          return $filter('filter')(self.yearsList, { name: year }).length > 0;
        };

        self.showCollapseButton = function (text) {
          return text.length > 125;
        };

        self.getShortDescription = function (text) {
          return $filter('limitTo')(text, 125, 0);
        };

        self.collapseDescription = function (index) {
          if (self.expandedTextIndex !== index) {
            self.expandedTextIndex = index;
          }
          else {
            self.expandedTextIndex = undefined;
          }
        };

        self.optionClicked = function (index) {

          if(index === 0){
            $location.path(URLS.COURSEDETAIL(self.selectedCourseIndex));
          }

        };

        self.selectCourseIndex = function (index) {
          //active = !active;

          self.expandedTextIndex = undefined;
          if (self.selectedCourseIndex !== index) {
            self.selectedCourseIndex = index;
            self.undefinedIndex = false;
          }
          else {
            self.selectedCourseIndex = undefined;
            self.undefinedIndex = true;
          }
        };
      }]);
}(angular, frontApp));
