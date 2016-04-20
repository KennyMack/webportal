/**
 * Created by jonathan on 29/02/16.
 */
'use strict';
const database      = require('../database/database');
const utils         = require('../utils/utils');

const teachersSchema = database.mongoose.Schema({
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
    schedule: [{
        day:{
            type: Number,
            required: true,
            index: true
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
    subjects:[{
        _id: {
            type: database.mongoose.Schema.Types.ObjectId,
            ref: 'subjects',
            required: true,
            index: true
        },
        description: {
            type: String,
            required: true
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


var preUpdate = function(teacher, next) {
    teacher.modified = utils.getCurrentDateTime();
    next();
};

teachersSchema.pre('save', function(next){
    let teacher = this;
    preUpdate(teacher, next);
});

teachersSchema.pre('update', function(next) {
    let teacher = this._update['$set'];

    preUpdate(teacher, next);

});

module.exports.teachers = database.db.model('teachers', teachersSchema);