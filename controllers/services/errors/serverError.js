var customError = require('./customError');

module.exports = {
    internal_error : new customError(
        500,
        'INTERNAL_ERROR',
        'Something went wrong on server. Please contact server admin.'
    ),
}