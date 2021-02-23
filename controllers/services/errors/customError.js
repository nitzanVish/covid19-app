var util = require('util');

function customError(httpCode,internalCode, description, details = null){

    this.httpCode = httpCode;
    this.internalCode = internalCode;
    this.description = description;
    this.details = details;
}

// Inherit the Error class
util.inherits(customError, Error);

module.exports = customError;