/**
 * Created by jonathan on 29/02/16.
 */
var database = require('../database/database');
var utils = require('../utils/utils');

var studentsSchema = new database.mongoose.Schema({
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
    }
});