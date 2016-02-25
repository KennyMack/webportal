/**
 * Created by jonathan on 23/02/16.
 */
module.exports.request = require("request");
module.exports.app = require("./www");
module.exports.base_url = "http://localhost:3000/";
var frisby = require('frisby');
var options = {
    request: {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJvYmplY3RpZDEyMzQ1NiIsIm5hbWUiOiJKb25hdGhhbiIsInVzZXJuYW1lIjoiS2VubnkiLCJkYXRlIjoxNDU2MTk5OTUwMjQxLCJpYXQiOjE0NTYxOTk5NTAsImV4cCI6MTQ1NjI4NjM1MH0.ndP6gSd6ZkdzfIoIsI5DPfH7R_IbATaEPDZ9vCGqtuY'
        }
    }
};

frisby.globalSetup(options);

module.exports.frisby = frisby;