
function ErrorResponse(errorObj){
    this.STATUS_CODE=errorObj.httpCode;
    this.INTERNAL_STATUS_CODE = errorObj.internalCode;
    this.DESCRIPTION = errorObj.description;
    this.DETAILS = errorObj.details ? errorObj.details : null;
    this.DATA = errorObj.data ? errorObj.data : null;
}


module.exports = ErrorResponse;
