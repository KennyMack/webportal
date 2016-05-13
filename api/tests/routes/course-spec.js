/**
 * Created by jonathan on 30/03/16.
 */
var config = require('../config-test');
var url = config.base_url + 'courses';

var courseNameNum = Math.floor((Math.random() * 14));
var courseNum = Math.floor((Math.random() * 42));

config.frisby.create('Get Courses')
    .get(url)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Get Course')
    .get(url+ '/56dcd3f71d040b7452d6e192')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Get Course 404')
    .get(url+ '/56dcd3f71d040b7452d6e1a2')
    .expectStatus(404)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Create Course')
    .post(url,
    {
        identify: Math.floor((Math.random() * 9999999999) + 1).toString(),
        name: config.courseName[courseNum],
        description: config.courseType[courseNameNum] + " " +  config.courseName[courseNum],
        active: '1',
        duration: {
            start: '2016-11-01T20:00:00.000Z',
            end: '2016-12-01T20:00:00.000Z'
        },
        course_type: {
            _id: '56f0c8bbceb0357255b860b6',
            description: 'Superior - Exatas'
        }
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Add Subject')
    .post(url+ '/56fc7984cfe0ecbc1d372534/add-subject',
    {
        teacher: '56fc67722d99e7ca16791d37',
        subject: '56db962a3a8281116f5802eb'
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Add Schedule')
    .post(url+ '/56fc7984cfe0ecbc1d372534/add-schedule',
    {
        day: 1,
        subject: '56db962a3a8281116f5802eb',
        duration: {
            start : "2016-12-01T12:00:01.000Z",
            end : "2016-12-01T13:00:00.000Z"
        }
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();