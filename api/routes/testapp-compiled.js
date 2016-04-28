/**
 * Created by jonathan on 17/04/16.
 */
'use strict';
// TODO: Just a test

module.exports = function (express, io) {

    var router = express.Router();

    var q = require('q');
    var students = require('../controller/students-controller');
    var courses = require('../controller/courses-controller');
    var subjects = require('../controller/subjects-controller');

    var getCourses = function getCourses(callback) {
        var defer = q.defer();

        courses.listCourses().then(function (courses) {
            defer.resolve(courses);
        }, function (err) {
            defer.reject(err);
        });

        defer.promise.nodeify(callback);
        return defer.promise;
    };

    var getStudents = function getStudents(value, callback) {
        var defer = q.defer();
        console.log('students');
        console.log(value);

        students.list().then(function (students) {
            defer.resolve(students);
        }, function (err) {
            defer.reject(err);
        });

        defer.promise.nodeify(callback);
        return defer.promise;
    };

    var getSubjects = function getSubjects(value, callback) {
        var defer = q.defer();
        console.log('Subjects');
        console.log(value);

        subjects.list().then(function (subjects) {
            defer.resolve(subjects);
        }, function (err) {
            defer.reject(err);
        });

        defer.promise.nodeify(callback);
        return defer.promise;
    };

    router.get('/', function (req, res) {
        getCourses().then(getStudents).then(getSubjects).then(function (done) {
            //OK
            console.log('end');
            console.log(done);
        }).fail(function (err) {
            // error
            console.log('err');
            console.log(err);
        });
    });

    return router;
};

//# sourceMappingURL=testapp-compiled.js.map