/**
 * Created by jonathan on 21/02/16.
 */
var database = require('../database/database');
var bcrypt = require('bcrypt');

var userSchema = new database.mongoose.Schema({
    name: { type: String,
            required: true },
    username: { type: String,
                required: true,
                index: true,
                unique: true },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    create_at: {
        type: Date,
        required: true,
        default: Date.now()
    }

});

userSchema.pre('save', function(next){
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});



exports.users = database.db.model('users', userSchema);