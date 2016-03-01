/**
 * Created by jonathan on 29/02/16.
 */
var database = require('../database/database');
var utils    = require('../utils/utils');
var subjects = require('../models/subjects-model');

var coursesSchema = database.mongoose.Schema({
    identify: {
       type: String
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    subjects:[

    ],
    active: {
        type: Number,
        required: true
    },
    create_at: {
        type: Date,
        required: true,
        default: utils.getCurrentDateTime()
    },
    modified: {
        type: Date,
        required: true,
        default: utils.getCurrentDateTime()
    }
});

var preUpdate = function(student, next) {
    student.modified = utils.getCurrentDateTime();
    next();
};

userSchema.pre('save', function(next){
    var course = this;
    preUpdate(course, next);
});

userSchema.pre('update', function(next) {
    var course = this._update['$set'];

    preUpdate(course, next);

});


module.exports.courses = database.db.model('courses', coursesSchema);