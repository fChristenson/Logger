# Logger #

## Simple logging service with a rest api ##

### Dependencies ###

* [Node](https://nodejs.org/)
* [Npm](https://www.npmjs.com/)
* [MongoDB](https://www.mongodb.org/)

### ENV variables ###

* MONGODB_URI: The uri to your [MongoDB](http://docs.mongodb.org/manual/reference/connection-string/) server.
* LOGGER_LOGGING_LEVEL: Loggers local logging level. (Defaults to "debug", see [winston](https://github.com/winstonjs/winston) documentation for more info.)
* LOGGER_PORT: Port to run the application on. (Defaults to 3000.)