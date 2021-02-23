
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const customErrors = require('../controllers/services/errors');
const Cart = require('../models/CartModel');
const Schema = mongoose.Schema;

    const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            // required: true,
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            // required: true,
            minlength: 5,
            maxlength: 255,
            // unique: true
        },
        password: {
            type: String,
            // required: true,
            minlength: 3,
            maxlength: 255
        },
        address: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        gender: {
            type: Boolean
        },
        token:{
            type: String
        },
        isSeller: {
            type: Boolean,
            default: false
        },
        cart:{
            type: Schema.ObjectId,
            ref: 'Cart'
        }
    });

    //Generate token by user id
    UserSchema.methods.generateAuthToken = async function(id = null) { 
        return  jwt.sign({ _id: id }, config.get('app-key'));
    }

    //Merge random cart with user cart
    UserSchema.methods.mergeUserCarts = async function(currentUserId, randomUserId){

        let randomUserCart = await Cart.findOne({user_id: randomUserId});
        let currentUserCart = await Cart.findOne({user_id: currentUserId});
        
        //Empty carts
        if(!randomUserCart && !currentUserCart){
            return;
        }
        //randomUserCart and currentUserCart are exists
        if(randomUserCart && currentUserCart){
            
            let isRadProdExists = false;
            randomUserCart.products.forEach(randProd => {

                isRadProdExists = false;
                currentUserCart.products.forEach(currentProd => {
                    // product_id (is an object) was converted to string , in order to compare between values 
                    // if product in random cart exists in user cart, add it qty.
                    if(currentProd.product_id.toString() == randProd.product_id.toString()){
                        currentProd.selectedQuantity += randProd.selectedQuantity;
                        isRadProdExists = true;
                        return;
                    }
                });
                // if product in random cart is not exists in user cart, add it.
                if(!isRadProdExists){
                    currentUserCart.products.push(randProd);
                }
            
            });
            // Save user cart
            await currentUserCart.save();

            //Remove random cart
            await randomUserCart.remove();
            return;
        }
        // Only random cart is exists
        if(randomUserCart){
            randomUserCart.user_id = currentUserId;
            await randomUserCart.save();
            return;
        }
    }

    // Verify user (password and email)
    UserSchema.methods.checkUser = async function(req){

        const user = await User.findOne({email: req.body.email});
        if(user){
            if(await bcrypt.compare(req.body.password, user.password)){
                return user;
            }
        }
        return false;
    }

    //Create a new user or update user (the same inputs: req.body) 
    //in case of user inputs (req.body) are compatible with our logic (like unique email)
    UserSchema.methods.addOrUpdateUser = async function(req){
        // requested values
        let userData = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            address:(req.body.address) ? req.body.address : '',
            phoneNumber:(req.body.phoneNumber) ? req.body.phoneNumber : '',
            gender: (req.body.gender) ? req.body.gender : 0,
        };
    
        const id = (req.user) ? req.user._id : this._id;
        
        //check if req email already exists
        let users = await User.find({ email: userData.email });
        let resObj = {};
        users.forEach(user => {
            //if another user id used this email
            if(user.email ==  userData.email && user._id.toString() != id.toString() ){
                resObj = {success:false, message: customErrors.clientError.email_exists};
            }
        });

        if(Object.keys(resObj).length > 0){
            return resObj;
        }
        //check if req name already exists
        // let usersByName = await User.find({ name: userData.name });
        // usersByName.forEach(user => {
        //     if(user.name ==  userData.name && user._id.toString() != id.toString() ){
        //         resObj = {success:false, message: customErrors.clientError.name_exists};
        //     }
        // });

        // if(Object.keys(resObj).length > 0){
        //     return resObj;
        // }

        userData.password = await bcrypt.hash(userData.password, 10);
        return {success:true, data:userData};
    }

    //Remove token property from this user 
    UserSchema.methods.unsetToken = async function(){
        return await this.updateOne({$unset : {token :1}});
    }
    //verify Token
    UserSchema.methods.verifyToken = async function (token){
        try{
            const decoded = await jwt.verify(token, config.get("app-key"));
            if(!decoded){
                return false;
            }
        
            let user = await User.findById(decoded._id);
            
            return user && user.token != undefined && user.token == token
                ? user 
                : false;
                
        } catch(error) {

            console.log(error);
        }
    }

    const User = mongoose.model('User', UserSchema);
    
    exports.User = User; 