/**
 * Created by jonathan on 21/02/16.
 */
var database = require('../database/database');
var bcrypt = require('bcrypt');
var date = require('../utils/utils');

var userSchema = new database.mongoose.Schema({
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
    }

});

var preUpdate = function(user, next){
    user.modified = date.getCurrentDateTime();

    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
};

userSchema.pre('save', function(next){
    var user = this;
    preUpdate(user, next);
});

userSchema.pre('update', function(next) {
    var user = this._update['$set'];

    preUpdate(user, next);

});


exports.users = database.db.model('users', userSchema);