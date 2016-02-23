/**
 * Created by jonathan on 23/02/16.
 */
var usersRoutes = require('../../routes/users');
var config = require('../config-test');
var url = config.base_url + 'users/test';

var options = {
    url: url,
    headers: {
        'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJvYmplY3RpZDEyMzQ1NiIsIm5hbWUiOiJKb25hdGhhbiIsInVzZXJuYW1lIjoiS2VubnkiLCJkYXRlIjoxNDU2MTk5OTUwMjQxLCJpYXQiOjE0NTYxOTk5NTAsImV4cCI6MTQ1NjI4NjM1MH0.ndP6gSd6ZkdzfIoIsI5DPfH7R_IbATaEPDZ9vCGqtuY'
    }
};

describe("Hello World Server", function() {
    describe("GET /", function() {
        it("returns status code 200", function(done) {
            config.request.get(options, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it("returns Hello World (json)", function(done) {
            config.request.get(options, function(error, response, body) {
                expect(JSON.parse(body)).toBe({"hello":"word" });
                config.app.closeServer();
                done();
            });
        });
    });
});