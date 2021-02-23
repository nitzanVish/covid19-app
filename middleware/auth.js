
const { User } = require('../models/userModel');
const customErrors = require('../controllers/services/errors');
const generateResponse = require('../controllers/services/response/generateResponse');

// Error response
function generateErrorRes(res){

    var response = new generateResponse(true, null, {
        errorReason: customErrors.clientError.invalid_token
    }); 
    return res.status(response.STATUS_CODE).send(response); 
}

module.exports =  async function(req, res, next) { 
    try {
        // Get token from cookies
        const token = req.cookies.auth;
    
        const isUpdateUserRoute = (req.url == '/user/update') ? true : false;

        // Return error in case of updating user's data and missing token
        if(isUpdateUserRoute && !token){
            generateErrorRes(res);
            return;
        }
        if (!token){
            //Generate token
            const user = new User();
            user.token = await user.generateAuthToken(user._id);
            await user.save();
            req.user = user;
            next();
            return;
        } 

        //Verify token
        const user = new User();
        let isUser = await user.verifyToken(token);
        // Verified token
        if(isUser){
            req.user = isUser;
            next();
            return;
        } else {
            generateErrorRes(res);
            return;
        }
        
    } catch (ex) {
        console.log(ex);
        var response = new generateResponse(true, null);
        return res.status(response.STATUS_CODE).send(response);
    }
};