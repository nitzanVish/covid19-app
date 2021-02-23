
const { validationResult } = require('express-validator');
const generateResponse = require('../../services/response/generateResponse')
const customErrors = require('../../services/errors');

module.exports = {
    // Check if validation's errors are exists
    checkValidation(req){

        const validationErrors = validationResult(req);
        let response = {};
    
        if (!validationErrors.isEmpty()) {
            response = new generateResponse(true, validationErrors.errors, {
                errorReason: customErrors.clientError.validation
            });
        } 
        return Object.keys(response).length > 0 ? response : false;
    },

}