'use strict';

var winston = require('winston');

winston.level = process.env.LOGGER_LOGGING_LEVEL || 'debug';

module.exports = winston;