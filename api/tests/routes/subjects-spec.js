/**
 * Created by jonathan on 30/03/16.
 */
var config = require('../config-test');
var url = config.base_url + 'subjects';

var subjectsNum = Math.floor((Math.random() * 26));

config.frisby.create('Get Subjects')
    .get(url)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Get Subject')
    .get(url+ '/56db96183a8281116f5802ea')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Get Subject 404')
    .get(url+ '/56db96183a8281116f5802aa')
    .expectStatus(404)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Create Subject')
    .post(url,
    {
        "description": config.subjects[subjectsNum]
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();


