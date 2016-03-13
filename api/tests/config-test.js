/**
 * Created by jonathan on 23/02/16.
 */
module.exports.request = require("request");
module.exports.app = require("../bin/www");
module.exports.base_url = "http://localhost:3000/";
var frisby = require('frisby');
var options = {
    request: {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmRiOGQ1ZDNhODI4MTExNmY1ODAyZTMiLCJlbWFpbCI6InN0ZXZlQGpvYnMuY29tIiwidXNlcm5hbWUiOiJTdGV2ZSIsImRhdGUiOiIyMDE2LTAzLTA1VDIyOjUyOjQ3LTAzOjAwIiwiaWF0IjoxNDU3MjI5MTY3LCJleHAiOjE0NTczMTU1Njd9.EhCuEhgWZ9kggVok2QXaPUPNuG3TVhA4WyjR4wTEb78'
        }
    }
};
module.exports.names =[
    'Edward',
    'Jean',
    'Mand',
    'Paul',
    'Dilz',
    'Carl',
    'Guz'
];
module.exports.surnames = [
    'Ortiz',
    'Marc',
    'Paul',
    'Allen',
    'Stuart',
    'Drew',
    'Rainz'
];

frisby.globalSetup(options);

module.exports.frisby = frisby;