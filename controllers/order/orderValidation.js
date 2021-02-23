
const { body } = require('express-validator');

module.exports = {

    basicValidation(){
        return [
            body('products').not().isEmpty().trim().escape(),
            body('total_price').not().isEmpty().trim().escape()
        ];
    }
}