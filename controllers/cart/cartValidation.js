

const { body } = require('express-validator');

module.exports = {
    //check the receive value: not empty, trim, escape: replace <, >, &, ', " and / with HTML entities. 
    inputValidation(params){

        const validationArr = [];
        params.forEach(element => {
            validationArr.push(body(element).not().isEmpty().trim().escape());
            
        });
        return validationArr;
    },

}
