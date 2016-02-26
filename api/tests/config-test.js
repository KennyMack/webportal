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
            'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJvYmplY3RpZDEyMzQ1NiIsIm5hbWUiOiJKb25hdGhhbiIsInVzZXJuYW1lIjoiS2VubnkiLCJkYXRlIjoxNDU2MzY1ODgzMDQ3LCJpYXQiOjE0NTYzNjU4ODMsImV4cCI6MTQ1NjQ1MjI4M30.DhXLqkAf3wjHTzT4GLblQDXXA5tkO_tPlzpbHqooNZA'
        }
    }
};

frisby.globalSetup(options);

module.exports.frisby = frisby;