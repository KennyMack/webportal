/**
 * Created by jonathan on 28/04/16.
 */
'use strict';

const database = require('../database/database');
const utils    = require('../utils/utils');

const managersSchema = database.mongoose.Schema({
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



const preUpdate = function(manager, next) {
    manager.modified = utils.getCurrentDateTime();
    next();
};

managersSchema.pre('save', function(next){
    let manager = this;
    preUpdate(manager, next);
});

managersSchema.pre('update', function(next) {
    let manager = this._update['$set'];

    preUpdate(manager, next);

});

module.exports.managers = database.db.model('managers', managersSchema);