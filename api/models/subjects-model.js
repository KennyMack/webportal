/**
 * Created by jonathan on 29/02/16.
 */
'use strict';
const database = require('../database/database');

const subjectsSchema = database.mongoose.Schema({
    description: {
        type: String,
        required: true,
        index: true,
        unique: true
    }
});


module.exports.subjects = database.db.model('subjects', subjectsSchema);