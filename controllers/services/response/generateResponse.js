
var customErrors = require('../errors');
var errorResponse = require('./errorResponse');
var successResponse = require('./successResponse');
var successResponseData = require('./successResponseData');

function GenerateResponse(err, data, errorMessage = {}){

    errorMessage.errorReason = errorMessage.hasOwnProperty('errorReason')
        ? errorMessage.errorReason
        : customErrors.serverError.internal_error ;


    if(err){
        return new errorResponse({...errorMessage.errorReason, data: data});
    }

    if(!data || data.length < 1 || Object.keys(data) < 1){
        return new errorResponse(customErrors.clientError.missing_data);
    }
    return new successResponse({...successResponseData.basic,data:data});
}

module.exports = GenerateResponse;