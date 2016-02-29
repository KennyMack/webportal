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
            'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmNlNmM5YmFmNmFmYTM1NmRiMThiOTYiLCJuYW1lIjoiVG9ueSBTdGFyayIsImVtYWlsIjoidG9ueUBzdGFyay5jb20iLCJ1c2VybmFtZSI6Iklyb24gTWFuIDIiLCJkYXRlIjoiMjAxNi0wMi0yOVQwMDoyNjoxNS0wMzowMCIsImlhdCI6MTQ1NjcxNjM3NSwiZXhwIjoxNDU2ODAyNzc1fQ.j-AVZ5djv8szVG_6SWAb-posjMwc4t9vjU2VWQqXcss'
        }
    }
};

frisby.globalSetup(options);

module.exports.frisby = frisby;