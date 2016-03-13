/**
 * Created by jonathan on 29/02/16.
 */
var database = require('../database/database');
var utils = require('../utils/utils');

var courseTypeSchema = database.mongoose.Schema({
    description: {
        type: String,
        required: true
    }
});

module.exports.courseType = database.db.model('courseType', courseTypeSchema);

