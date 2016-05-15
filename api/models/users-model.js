/**
 * Created by jonathan on 21/02/16.
 */
'use strict';

const database = require('../database/database');
const bcrypt   = require('bcrypt');
const date     = require('../utils/utils');

const userSchema = database.mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    active: {
        type: Number,
        required: true,
        default: 0
    },
    last_login:{
        type: Date
    },
    create_at: {
        type: Date,
        required: true,
        default: date.getCurrentDateTime()
    },
    modified:{
        type: Date,
        required: true,
        default: date.getCurrentDateTime()
    },
    student_id: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: 'students',
        index: true
    },
    teachers_id: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: 'teachers',
        index: true
    },
    manager_id: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: 'managers',
        index: true
    },
    master_id: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: 'masters',
        index: true
    }
});

const preUpdate = function(user, next){
    user.modified = date.getCurrentDateTime();

    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
};

userSchema.pre('save', function(next){
    let user = this;
    preUpdate(user, next);
});

userSchema.pre('update', function(next) {
    let user = this._update['$set'];

    preUpdate(user, next);

});

exports.users = database.db.model('users', userSchema);