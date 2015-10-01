var express = require('express');
var app = express();
var assert = require('chai').assert;
var request = require('request');
var bodyParser = require('body-parser');
var expressController = require('../expressController');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.listen(3000);

global.app = app;
global.request = request;
global.expressController = expressController;
global.assert = assert;

function postAndCheck(uri, data, done, check, options){
    runAndCheck(uri, data, 'post', done, check);
}

function getAndCheck(uri, data, done, check, options){
    runAndCheck(uri, data, 'get', done, check);
}

function runAndCheck(uri, data, verb, done, check, options = { }){
    request({
        uri,
        method: verb,
        body: data,
        json: true
    }, function(error, response, obj){
        check(obj);
        done();
    });
}

function verbsAreRejected(uri, done, verbs){
    Promise.all(verbs.map(runVerb)).then(() => done());

    function runVerb(verb){
        return new Promise(res => {
            request[verb](uri, {}, function (error, response, obj) {
                assert.isTrue(new RegExp(`cannot ${verb}`, 'i').test(obj), `${uri} didn't fail for ${verb} but should have`); //this is how request handles requests for which the very is not defined....
                res();
            });
        }).catch(() => null)
    }
}

global.utils = {
    postAndCheck,
    getAndCheck,
    runAndCheck,
    verbsAreRejected
};