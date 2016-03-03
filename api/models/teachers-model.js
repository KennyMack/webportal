/**
 * Created by jonathan on 29/02/16.
 */
var database      = require('../database/database');
var subjectsModel = require('./subjects-model');
var utils         = require('../utils/utils');

var teachersSchema = database.mongoose.Schema({
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
    schedule: [

    ],
    subjects:[
        subjectsModel.subjects
    ],
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
    var teacher = this;
    preUpdate(teacher, next);
});

teachersSchema.pre('update', function(next) {
    var teacher = this._update['$set'];

    preUpdate(teacher, next);

});

module.exports.teachers = database.db.model('teachers', teachersSchema);