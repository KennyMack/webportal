/**
 * Created by jonathan on 29/02/16.
 */
var database = require('../database/database');

var subjectsSchema = database.mongoose.Schema({
    description: {
        type: String,
        required: true,
        index: true,
        unique: true
    }
});


module.exports.subjects = database.db.model('subjects', subjectsSchema);