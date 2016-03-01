/**
 * Created by jonathan on 22/02/16.
 */
var moment = require('moment');

module.exports.OPERATION_STATUS = {
    NEW: 'NEW',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    SELECT: 'SELECT'
};

module.exports.getCurrentDateTime = function () {
    return moment().format();
};

module.exports.multiply = function(var1, var2){
    return var1 * var2;
};