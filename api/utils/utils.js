/**
 * Created by jonathan on 22/02/16.
 */
var moment = require('moment');
var utils  = require('../config/config');

module.exports.OPERATION_STATUS = {
    NEW: 'NEW',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    SELECT: 'SELECT'
};

module.exports.getCurrentDateTime = function () {
    return moment().format();
};

module.exports.isDate = function (date) {
    return moment(date, utils['dateTimeFormat']).isValid();
};

module.exports.dateFormat = function (date) {
    return moment(date, utils['dateTimeFormat']).format();
};

module.exports.betweenII = function (value, a, b) {
    return (value >= a && value <= b);
};
module.exports.betweenEI = function (value, a, b) {
    return (value > a && value <= b);
};
module.exports.betweenIE = function (value, a, b) {
    return (value >= a && value < b);
};
module.exports.betweenEE = function (value, a, b) {
    return (value > a && value < b);
};

module.exports.multiply = function(var1, var2){
    return var1 * var2;
};