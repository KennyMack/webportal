/**
 * Created by jonathan on 28/04/16.
 */
'use strict';

const database = require('../database/database');
const utils    = require('../utils/utils');

const mastersSchema = database.mongoose.Schema({
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



const preUpdate = function(master, next) {
    master.modified = utils.getCurrentDateTime();
    next();
};

mastersSchema.pre('save', function(next){
    let master = this;
    preUpdate(master, next);
});

mastersSchema.pre('update', function(next) {
    let master = this._update['$set'];

    preUpdate(master, next);

});

module.exports.masters = database.db.model('masters', mastersSchema);