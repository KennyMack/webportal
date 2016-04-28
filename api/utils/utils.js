/**
 * Created by jonathan on 22/02/16.
 */
'use strict';

const moment = require('moment');
const utils  = require('../config/config');

module.exports.OPERATION_STATUS = {
    NEW: 'NEW',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    SELECT: 'SELECT'
};

module.exports.getCurrentDateTime =  () => {
    return moment().format();
};

module.exports.isDate =  (date) => {
    return moment(date, utils['dateTimeFormat']).isValid();
};

module.exports.dateFormat =  (date) => {
    return moment(date, utils['dateTimeFormat']).format();
};

module.exports.betweenII =  (value, a, b) => {
    return (value >= a && value <= b);
};
module.exports.betweenEI =  (value, a, b) => {
    return (value > a && value <= b);
};
module.exports.betweenIE =  (value, a, b) => {
    return (value >= a && value < b);
};
module.exports.betweenEE =  (value, a, b) => {
    return (value > a && value < b);
};

module.exports.multiply = (var1, var2)=> {
    return var1 * var2;
};