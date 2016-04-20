/**
 * Created by jonathan on 29/02/16.
 */
'use strict';
const database = require('../database/database');
const utils = require('../utils/utils');

const courseTypeSchema = database.mongoose.Schema({
    description: {
        type: String,
        required: true
    }
});

module.exports.courseType = database.db.model('courseType', courseTypeSchema);

