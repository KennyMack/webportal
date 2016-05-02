/**
 * Created by jonathan on 29/02/16.
 */
'use strict';
const database   = require('../database/database');
const courses    = require('./courses-model');
const courseType = require('./course-type-model');
const utils      = require('../utils/utils');

const studentsSchema = database.mongoose.Schema({
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
    phone: [

    ],
    emails: [

    ],
    address: [
        //TODO: Make address Model
    ],
    courses: [{
        _id:{
            type: database.mongoose.Schema.Types.ObjectId,
            ref: 'courses',
            required: true,
            index: true
        },
        active: {
            type: Number,
            required: true,
            default: 1
        },
        duration: {
            start: {
                type: Date,
                required: true,
                index: true
            },
            end: {
                type: Date,
                index: true
            }
        }

    }],
    create_at: {
        type: Date,
        default: utils.getCurrentDateTime(),
        required: true
    },
    modified:{
        type: Date,
        required: true,
        default: utils.getCurrentDateTime()
    },
    active:{
        type: Number,
        required: true,
        default: 0
    }
});


const preUpdate = function(student, next) {
    student.modified = utils.getCurrentDateTime();
    next();
};

studentsSchema.pre('save', function(next){
    let student = this;
    preUpdate(student, next);
});

studentsSchema.pre('update', function(next) {
    let student = this._update['$set'];

    preUpdate(student, next);

});

module.exports.students = database.db.model('students', studentsSchema);