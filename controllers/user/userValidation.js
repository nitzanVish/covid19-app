
const { body } = require('express-validator');

module.exports = {
    // Validation on email & password
    basicUserValidation: function(){
        let userErrors = [];
        userErrors.push(body('email').isEmail().not().isEmpty());
        userErrors.push(body('password').not().isEmpty().trim());
        return userErrors;
    },
    // Validation on email & password & name & address & phone & gender
    signUpValidation: function(){
        let userErrors = [];
        userErrors.push(body('name').not().isEmpty().trim());
        userErrors.push(body('address').trim());
        userErrors.push(body('phoneNumber').trim());
        userErrors.push(body('gender').isBoolean());
        userErrors.push(...this.basicUserValidation());
        return userErrors;  
    },

}

