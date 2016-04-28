/**
 * Created by jonathan on 21/02/16.
 */
'use strict';

var mongoose = require('mongoose');
var config = require('../config/config');
var database = mongoose.connect(config['database']).connection;

//database.on('error', console.error.bind(console, 'Erro ao conectar no banco'));

module.exports.db = database;
module.exports.mongoose = mongoose;

//# sourceMappingURL=database-compiled.js.map