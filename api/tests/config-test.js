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
            'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmNlNmM5YmFmNmFmYTM1NmRiMThiOTYiLCJlbWFpbCI6InRvbnlAc3RhcmsuY29tIiwidXNlcm5hbWUiOiJJcm9uIE1hbiAyIiwiZGF0ZSI6IjIwMTYtMDMtMDFUMDA6MzU6MjgtMDM6MDAiLCJpYXQiOjE0NTY4MDMzMjgsImV4cCI6MTQ1Njg4OTcyOH0.sc2GFiglORFzLcwcRxftwOQmKkXbBO5gPvi6Cja5B6E'
        }
    }
};

frisby.globalSetup(options);

module.exports.frisby = frisby;