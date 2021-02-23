
function successResponse(obj){
    this.STATUS_CODE = obj.httpCode;
    this.INTERNAL_STATUS_CODE  = obj.internalCode;
    this.DATA = obj.data
}

module.exports = successResponse;