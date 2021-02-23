
var customError = require('./customError');
// Define error message
module.exports = {
    unavailableOrder: new customError(
        200,
        407,
        'Check your order',
        'Unavailable quantity or price'
    ),
    emptyOrder: new customError(
        200,
        408,
        'Empty order',
        'Empty order'
    ),
    unauthorized: new customError(
        200,
        401,
        'Unauthorized',
        'The request requires user authentication.'
    ),
    try_again:new customError(
        200,
        403,
        'Try agin',
        'Please, Try agin.'
    ),
    validation: new customError(
        200,
        402,
        'VALIDATION',
        'INVALID_INPUTS'
    ),
    requested_quantity: new customError(
        200,
        406,
        'Requested quantity bigger then inventory',
        'Please, Try agin.'
    ),
    quantityError:new customError(
        200,
        408,
        'Requested quantity bigger then inventory',
        'Please, Try agin.'
    ),
    missing_data: new customError(
        200,
        400,
        'Missing_Data',
        'Please check your parameters.'
    ),
    invalid_id: new customError(
        200,
        400,
        'INVALID_ID',
        'This requested id does not exists.'
    ),
    invalid_id_token: new customError(
        200,
        400,
        'INVALID_INPUTS',
        'The requested id or token does not exists.'
    ),
    email_exists: new customError(
        200,
        403,
        'EMAIL_EXISTS',
        'This email address already in use'
    ),
    name_exists: new customError(
        200,
        404,
        'NAME_EXISTS',
        'This name already in use'
    ),
    incorrect_inputs: new customError(
        200,
        405,
        'INCORRECT_INPUTS',
        'Check your inputs'
    ),
    invalid_token: new customError(
        200,
        400,
        'INCORRECT_TOKEN',
        'Check your token'
    )
}


