/**
 * Created by jonathan on 28/04/16.
 */
'use strict';
const config = require('../config-test');
const url = config.base_url + 'masters';

var mastersName = Math.floor((Math.random() * 6));
var mastersSurName = Math.floor((Math.random() * 6));

config.frisby.create('return error 404 (json)')
    .get(url + '/56cA7d755b012b846bf8f6aa')
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


config.frisby.create('return Masters (json)')
    .get(url)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Create Master (json)')
    .post(url,
    {
        "identify": Math.floor((Math.random() * 9999999999) + 1).toString(),
        "name": config.names[mastersName] + " " + config.surnames[mastersSurName],
        "gender": "M",
        "dob": "1990-10-21",
        "active": "1",
        "social_number": "369.123.455-32"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

mastersName = Math.floor((Math.random() * 6));
mastersSurName = Math.floor((Math.random() * 6));

config.frisby.create('Create Master 2 (json)')
    .post(url,
    {
        "identify": Math.floor((Math.random() * 9999999999) + 1).toString(),
        "name": config.names[mastersName] + " " + config.surnames[mastersSurName],
        "gender": "M",
        "dob": "1990-10-21",
        "active": "1",
        "social_number": "369.589.123-32"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();
/*
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
    .toss();*/

