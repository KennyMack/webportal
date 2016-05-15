/**
 * Created by jonathan on 28/02/16.
 */
var config = require('../config-test');
var url = config.base_url + 'mordor/authenticate';

config.frisby.create('Login Inválido')
    .post(url,
    {
        "username": "bill@gates.com",
        "password": "12345"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        success: false,
        data: "Usuário e/ou senha inválido."
    })
    .expectJSONTypes({
        success: Boolean,
        data: String
    })
    .toss();


config.frisby.create('Sem usuário e sem senha')
    .post(url,
    {
        "username": "",
        "password": ""
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        "success": false,
        "data": {
            "username": "Informe o E-mail ou Usuário.",
            "password": "Senha é de preenchimento obrigatório."
        }
    })

    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Sem senha')
    .post(url,
    {
        "username": "bill@gates.com",
        "password": ""
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        "success": false,
        "data": {
            "password": "Senha é de preenchimento obrigatório."
        }
    })

    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Sem Usuario')
    .post(url,
    {
        "username": "",
        "password": "12345"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON({
        "success": false,
        "data": {
            "username": "Informe o E-mail ou Usuário."
        }
    })
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

config.frisby.create('Login Ok')
    .post(url,
    {
        "username": "bill@gates.com",
        "password": "123456"
    }, { json: true })
    .expectStatus(200)
    .expectHeaderContains('Content-type', 'application/json')
    .expectJSON({
        success: true,
        //token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmNlNmM5YmFmNmFmYTM1NmRiMThiOTYiLCJuYW1lIjoiVG9ueSBTdGFyayIsImVtYWlsIjoidG9ueUBzdGFyay5jb20iLCJ1c2VybmFtZSI6Iklyb24gTWFuIDIiLCJkYXRlIjoiMjAxNi0wMi0yOVQwMDoyOTo1NS0wMzowMCIsImlhdCI6MTQ1NjcxNjU5NSwiZXhwIjoxNDU2ODAyOTk1fQ.L-Tedi8X0TIMK2nyXvBtgwpHZi8gG5B0O98vwt',
        message: 'Enjoy your token'
    })
    .expectJSONTypes({
        success: Boolean,
        data: Object
    })
    .toss();

