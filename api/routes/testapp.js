/**
 * Created by jonathan on 17/04/16.
 */
'use strict';
// TODO: Just a test
module.exports =  (express, io) => {

    const router = express.Router();

    const q = require('q');
    const students = require('../controller/students-controller');
    const courses = require('../controller/courses-controller');
    const subjects = require('../controller/subjects-controller');


    const getCourses =  (callback) => {
        let defer = q.defer();

        courses.listCourses()
            .then( (courses) => {
                defer.resolve(courses);
            },  (err) => {
                defer.reject(err);
            });

        defer.promise.nodeify(callback);
        return defer.promise;
    };

    const getStudents =  (value, callback) => {
        let defer = q.defer();
        console.log('students');
        console.log(value);

        students.list()
            .then( (students) => {
                defer.resolve(students);
            },  (err) => {
                defer.reject(err);
            });


        defer.promise.nodeify(callback);
        return defer.promise;
    };

    const getSubjects =  (value, callback) => {
        let defer = q.defer();
        console.log('Subjects');
        console.log(value);

        subjects.list()
            .then( (subjects) => {
                defer.resolve(subjects);
            },  (err) => {
                defer.reject(err);
            });


        defer.promise.nodeify(callback);
        return defer.promise;
    };

    router.get('/',  (req, res) => {
        getCourses()
            .then(getStudents)
            .then(getSubjects)
            .then( (done) => {
                //OK
                console.log('end');
                console.log(done);
            })
            .fail( (err) => {
                // error
                console.log('err');
                console.log(err);
            });
    });

    return router;
};