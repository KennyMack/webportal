/**
 * Created by jonathan on 29/02/16.
 */
var database   = require('../database/database');
var utils      = require('../utils/utils');

var coursesSchema = database.mongoose.Schema({
    identify: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
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
    course_type: {
        _id: {
            type: database.mongoose.Schema.Types.ObjectId,
            ref: 'courseType',
            required: true,
            index: true
        },
        description: {
            type: String,
            required: true
        }
    },
    subjects: [{
        teacher:{
            type: database.mongoose.Schema.Types.ObjectId,
            ref: 'teachers',
            required:true,
            index:true
        },
        subject: {
            type:  database.mongoose.Schema.Types.ObjectId,
            ref: 'subjects',
            required:true,
            index:true
        }
    }],
    schedule:[{
        day:{
            type: Number,
            required: true,
            index: true
        },
        subject: {
            type:  database.mongoose.Schema.Types.ObjectId,
            ref: 'subjects',
            required:true,
            index:true
        },
        duration: {
            start: {
                type: Date,
                required: true,
                index:true
            },
            end: {
                type: Date,
                required: true,
                index:true
            }
        }
    }],
    class: [{
        _id: {
            type: database.mongoose.Schema.Types.ObjectId,
            ref: 'students',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            index: true
        }
    }],
    active: {
        type: Number,
        required: true,
        default: 1
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

coursesSchema.pre('save', function(next){
    var course = this;
    preUpdate(course, next);
});

coursesSchema.pre('update', function(next) {
    var course = this._update['$set'];

    preUpdate(course, next);

});


module.exports.courses = database.db.model('courses', coursesSchema);