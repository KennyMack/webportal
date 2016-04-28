/**
 * Created by jonathan on 05/03/16.
 */
var config = require('../config-test');
var url = config.base_url + 'teachers';

var teacherName = Math.floor((Math.random() * 6));
var teacherSurName = Math.floor((Math.random() * 6));

config.frisby.create('return error 404 (json)')
    .get(url + '/56cA7d714b012b846bf8f6dc')
    .expectStatus(404)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        success: false,
        data: '404 - Not Found'
    })
    .expectJSONTypes({
        success: Boolean,
        data: String
    })
    .toss();



config.frisby.create('return Teacher (json)')
    .get(url + '/56db953e3a8281116f5802e7')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Create Teacher (json)')
    .post(url,
    {
        "identify": Math.floor((Math.random() * 9999999999) + 1).toString(),
        "name": config.names[teacherName] + " " + config.surnames[teacherSurName],
        "gender": "M",
        "dob": "1990-10-21",
        "active": "1",
        "social_number": "123.369.455-32"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Update Teacher (json)')
    .put(url,
    {
        "_id": "56fc666aab1c1e1e16cec4d3",
        "name": config.names[teacherName] + " " + config.surnames[teacherSurName],
        "gender": "M",
        "dob": "1990-10-21",
        "active": "1",
        "social_number": "123.369.455-32"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

