/**
 * Created by jonathan on 21/02/16.
 */
'use strict';

const mongoose  = require('mongoose');
const config    = require('../config/config');
const database  = mongoose.connect(config['database']).connection;

//database.on('error', console.error.bind(console, 'Erro ao conectar no banco'));

module.exports.db = database;
module.exports.mongoose = mongoose;
