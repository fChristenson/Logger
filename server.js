'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var loggerService = require('./app/services/loggerService');
var log = require('./app/config/logging');

app.use(bodyParser.json());

var routes = {

	description: 'Logger: simple logging service',
	version: '0.0.1',
	routes: ['/create', '/list', '/list/:app/:version', '/list/:app/:version/:from/:to'],
	notes: ':from & :to should use the format YYYY-MM-DD_HH:MM:SS'

};

app.get('/', function (req, res) {

	log.debug('GET: /');
	res.json(routes);

});

app.get('/list', function (req, res) {

	log.debug('GET: /list');
	loggerService.list(req, res);

});

app.get('/list/:app/:version', function (req, res) {

	log.debug('GET: /list/:app/:version');
	loggerService.list(req, res);

});

app.get('/list/:app/:version/:from/:to', function (req, res) {

	log.debug('GET: /list/:app/:version/:from/:to');
	loggerService.list(req, res);

});

app.post('/create/:appname/:appversion', function (req, res) {

	log.debug('POST: /create/:appname/:appversion');
	res.json(loggerService.save(req));

});


var port = process.env.LOGGER_PORT || 3000;

app.listen(port, function () {
	console.log('Listening on port ', port);
});