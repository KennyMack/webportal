/**
 * Created by jonathan on 23/02/16.
 */
var config = require('../config-test');
var url = config.base_url + 'users';

config.frisby.create('return error 404 (json)')
    .get(url + '/56ca7d7140012b846bf8f6dc')
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


config.frisby.create('return user (json)')
    .get(url + '/56ce6807a3b695466a37ea54')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    /*.expectJSON({
        success: true,
        data: {
            _id : "56ca7d7140012b846bf8f6d9",
            username : "Kenny",
            name : "Jonathan Henrique do Vale",
            password : "$2a$10$UC3fXQGUZOnBLLcBm/LPZOP3P96Ex0LG4i23F4gpPP4SmRFyZAC4K",
            create_at : "2016-02-22T03:11:30.688Z",
            __v : 0
        }
    })*/
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

//config.frisby.create('Create user (json)')
//    .post(url,
//    {
//        "email": "tony@stark.com.br",
//        "username" : "Iron Man",
//        "password" : "123456",
//        "passwordbis" : "123456"
//    }, { json: true })
//    .expectStatus(200)
//    .expectHeaderContains('content-type', 'application/json')
//    /*.expectJSON({
//     success: true,
//     data: {
//     _id : "56ca7d7140012b846bf8f6d9",
//     username : "Kenny",
//     name : "Jonathan Henrique do Vale",
//     password : "$2a$10$UC3fXQGUZOnBLLcBm/LPZOP3P96Ex0LG4i23F4gpPP4SmRFyZAC4K",
//     create_at : "2016-02-22T03:11:30.688Z",
//     __v : 0
//     }
//     })*/
//    .expectJSONTypes({
//        success: Boolean,
//        data: Object
//    })
//    .toss();

config.frisby.create('Update user (json)')
    .put(url,
    {
        "_id": "56ce6807a3b695466a37ea54",
        "email": "tony@stark.com.br",
        "name" : "Tony Stark",
        "username" : "Iron Man",
        "password" : "12345",
        "passwordbis" : "12345",
        "active": "1"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Status user Invalid (json)')
    .put(url,
    {
        "_id": "56ce6807a3b695466a37ea54",
        "email": "tony@stark.com",
        "name" : "Tony Stark",
        "username" : "Iron Man",
        "password" : "12345",
        "passwordbis" : "12345",
        "active": "5"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        success: false,
        data: {
            "active": "Status informado não é válido."
        }
    })
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

/*
config.frisby.create('put user (json)')
    .put(url,
    {
        "_id" : "56ca8b9836d9bf4f72d67d36",
        "name" : "Bruce Wayne",
        "username" : "Batman",
        "password" : "123456",
        "passwordbis" : "123456"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        success: true,
        data: {
            "ok": 1,
            "nModified": 1,
            "n": 1
        }
    })
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();*/
