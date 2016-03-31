/**
 * Created by jonathan on 30/03/16.
 */
var config = require('../config-test');
var url = config.base_url + 'course-type';

var courseTypeNum = Math.floor((Math.random() * 14));

config.frisby.create('Get Course Types')
    .get(url)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Get Course Type')
    .get(url+ '/56f0c95233647099c15acc48')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Get Course Type 404')
    .get(url+ '/56f0c95233647099c15acc43')
    .expectStatus(404)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Create Course Type')
    .post(url,
    {
        "description": config.courseType[courseTypeNum]
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Update Course Type')
    .put(url,
    {
        "_id": "56f0c95233647099c15acc48",
        "description": config.courseType[courseTypeNum]
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

