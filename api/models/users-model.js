/**
 * Created by jonathan on 21/02/16.
 */
var database = require('../database/database');
var bcrypt = require('bcrypt');
var date = require('../utils/utils');

var userSchema = database.mongoose.Schema({
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
        //TODO: Adicionar a referencia ao manager
        //ref: 'teachers',
        index: true
    },
    master_id: {
        type: database.mongoose.Schema.Types.ObjectId,
        //TODO: Adicionar a referencia ao master
        //ref: 'teachers',
        index: true
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