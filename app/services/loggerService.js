'use strict'

var mongoose = require('mongoose');
var moment = require('moment');
var logging = require('../config/logging');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017');

var Log = mongoose.model('log', {

	app: 'string',
	version: 'string',
	time: 'string',
	miliseconds: 'number',
	log: 'object'

});

var timestampFormat = 'YYYY-MM-DD HH:mm:ss:S:SS:SSS';

module.exports.save = function (req) {
	logging.debug('save');

	try {

		var time = new Date().getTime();
		var log = new Log({

			app: req.params.appname,
			version: req.params.appversion,
			time: moment(time).format(timestampFormat),
			miliseconds: time,
			log: req.body

		});

		log.save();
		logging.debug('save ok', log);

	} catch (err) {

		logging.error('save error', err);
		return {

				result: 'Save error!',
				error: err

			};

	}

	return {

			result: 'Log saved for ' + log.app + ' version ' + log.version + ' timestamp ' + log.time,
			log: log

		};
};

var handlerError = function (err, name, res) {

	logging.error(name + ' error', err);
	return res.json(err);

};

var findLogsByAppVersion = function (req, res, from, to) {
	logging.debug('findLogsByAppVersion', req.params.app, req.params.version, req.params.from, req.params.to);

	Log.find({app: req.params.app, version: req.params.version})
	   .where('miliseconds')
	   .gte(from)
	   .lte(to)
	   .exec(function (err, result) {

	   	if (err) return handlerError(err, 'findLogsByAppVersion', res);

		logging.debug('findLogsByAppVersion result', result);
		return res.json(result);

	});

};

var findLogs = function (res, from, to) {
	logging.debug('findLogs', from, to);

	Log.find({})
	   .where('miliseconds')
	   .gte(from)
	   .lte(to)
	   .exec(function (err, result) {

	    if (err) return handlerError(err, 'findLogs', res);

		logging.debug('findLogs result', result);
		return res.json(result);

	});

};

var dateStringToMilliseconds = function (dateString) {
	logging.debug('dateStringToMilliseconds', dateString);

	var array = dateString.split('_');
	var date = array[0];
	var time = array[1];
	var result = moment(date + ' ' + time);

	logging.debug('dateStringToMilliseconds result', result.format('x'), result.format(timestampFormat));
	return result.format('x');
};

var findLogsInRange = function (req, res) {
	logging.debug('findLogsInRange', req.params.app, req.params.version, req.params.from, req.params.to);

	var from = dateStringToMilliseconds(req.params.from);
	var to = dateStringToMilliseconds(req.params.to);

	logging.debug('findLogsInRange from to',from, to, moment(from).format(timestampFormat), moment(to).format(timestampFormat));

	Log.find({app: req.params.app, version: req.params.version})
	   .where('miliseconds')
	   .gte(from)
	   .lte(to)
	   .exec(function (err, result) {

	   	if (err) return handlerError(err, 'findLogsInRange', res);

		logging.debug('findLogsInRange result', result);
		return res.json(result);

	});

};

module.exports.list = function (req, res) {
	logging.debug('list');

	if (req.params.app && req.params.version && req.params.from && req.params.to) {

		findLogsInRange(req, res);

	} else {

		var date = new Date();
		var now = date.getTime();
		var twentyfourHoursAgo = now - 24 * 60 * 60 * 1000;

		if (req.params.app && req.params.version) {

			findLogsByAppVersion(req, res, twentyfourHoursAgo, now);

		} else {

			findLogs(res, twentyfourHoursAgo, now);

		}

	}

};