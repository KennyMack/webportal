/**
 * Created by jonathan on 29/02/16.
 */
var database = require('../database/database');
var courses = require('./courses-model');
var courseType = require('./course-type-model');
var utils = require('../utils/utils');



var studentsSchema = database.mongoose.Schema({
    identify: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    gender: {
        type: String
    },
    dob: {
        type: Date
    },
    social_number:{
        type: String
    },
    create_at: {
        type: Date,
        default: utils.getCurrentDateTime(),
        required: true
    },
    modified:{
        type: Date,
        required: true,
        default: date.getCurrentDateTime()
    },
    active:{
        type: Number,
        required: true,
        default: 0
    },
    phone: [

    ],
    address: [
        //TODO: Make address Model
    ],
    type: [
        courseType
    ],
    courses: [

    ]
});


var preUpdate = function(student, next) {
    student.modified = utils.getCurrentDateTime();
    next();
};

userSchema.pre('save', function(next){
    var student = this;
    preUpdate(student, next);
});

userSchema.pre('update', function(next) {
    var student = this._update['$set'];

    preUpdate(student, next);

});

module.exports.students = database.db.model('students', studentsSchema);