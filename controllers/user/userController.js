
const { User } = require('../../models/userModel');
const {validationResult } = require('express-validator');
const validation = require('./userValidation');
const customErrors = require('../services/errors');
const generateResponse = require('../services/response/generateResponse');
const inputValidation = require('../services/validation');

module.exports = function(app){
    
    app.post(["/user/update", "/user/signup"],validation.signUpValidation(), async (req, res, next) => {

        try{
            //Check validation
            let validationErr = inputValidation.checkValidation(req);
            // Validation error
            if(validationErr){
                return res.status(validationErr.STATUS_CODE).send(validationErr);
            }

            const isUpdateUserRoute = (req.url == '/user/update') ? true : false;

            let newUser = new User();
            
            //Create a new user or update user (the same inputs: req.body) 
            //in case of user inputs (req.body) are compatible with our logic (like unique email)
            const userLogic = await newUser.addOrUpdateUser(req);

            // if user inputs are compatible
            if(userLogic.success){
                if(!isUpdateUserRoute){
                    // create a new user
                    Object.keys(userLogic.data).forEach(key => {
                        newUser[key] = userLogic.data[key]
                    });
                    
                    newUser.token = await newUser.generateAuthToken(newUser._id);
                    userLogic.data.token = newUser.token;
                    await newUser.save();

                    //Merge random cart with new user
                    newUser.mergeUserCarts(newUser._id, req.user._id);
                    
                    //Remove random cart
                    await req.user.remove();
                } else {
                    // update user
                    userLogic.data.token = await newUser.generateAuthToken(req.user._id);
                    await User.updateOne({_id: req.user._id}, userLogic.data);
                }
                //hide password value after saving it to DB
                userLogic.data['password'] = undefined;
                
                var response = new generateResponse(false, userLogic.data);
                return res.cookie('auth',userLogic.data.token, {httpOnly: true}).status(response.STATUS_CODE).send(response);

            } else {
                //user inputs are incompatible with our logic
                var response = new generateResponse(true, null, {
                    errorReason: userLogic.message
                });
                return res.status(response.STATUS_CODE).send(response);
            }

        } catch(error){
            console.log(error);
            var response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }
    });
    
    // Sign in
    app.post('/user/signin', validation.basicUserValidation(), async (req, res) => {

        try{
            //Check validation
            let validationErr = inputValidation.checkValidation(req);
            // Validation error
            if(validationErr){
                return res.status(validationErr.STATUS_CODE).send(validationErr);
            }
            // Verify user (password and email)
            const matchedUser = await req.user.checkUser(req);
            // verified user
            if(matchedUser){
                //Generate token by user id
                matchedUser.token = await matchedUser.generateAuthToken(matchedUser._id);
                
                await matchedUser.save();

                //Merge random cart with user cart
                await matchedUser.mergeUserCarts(matchedUser._id, req.user._id);
                
                // Hide password value after saving it
                matchedUser['password'] = undefined;
                
                //Remove random user
                await req.user.remove();

                var response = new generateResponse(false, matchedUser);
                return res.cookie('auth',matchedUser.token, {httpOnly: true}).status(response.STATUS_CODE).send(response);
            } else {
                // Unverified user
                var response = new generateResponse(true, null, {
                    errorReason: customErrors.clientError.incorrect_inputs
                });
                return res.status(response.STATUS_CODE).send(response);
            
            }
        } catch(error){
            console.log(error);
            var response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }
        
    });

    // Logout by removing token property from user's obj in DB
    app.delete('/user/logout', async(req, res)=> {
        try{
            const user = await User.findById(req.user._id);
            let afterUpdated = await user.unsetToken();
            var response = new generateResponse(false, afterUpdated);
            return res.cookie('auth','', {httpOnly: true}).status(response.STATUS_CODE).send(response);
        } catch(error){
            console.log(error);
            var response = new generateResponse(true, null);
            return res.cookie('auth','', {httpOnly: true}).status(response.STATUS_CODE).send(response);
        }
    })

}

