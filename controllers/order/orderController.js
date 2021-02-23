const Order = require('../../models/orderModel');
const customErrors = require('../services/errors');
const generateResponse = require('../services/response/generateResponse');

const orderValidation = require('./orderValidation');
const Product = require('../../models/productModel');
const validation = require('../services/validation');


module.exports = function(app){
    // Add a new order 
    app.post('/api/order',orderValidation.basicValidation() ,async function(req, res, next){
        try {
            
            let validationErr = validation.checkValidation(req);
            // validation error
            if(validationErr){
                return res.status(validationErr.STATUS_CODE).send(validationErr);
            }

            const newOrder = new Order();
            // Get all products
            const availableProducts = await Product.find();

            //Check if order is available
            const isAvailableOrder = await newOrder.isAvailableOrder(availableProducts, req.safeBody);
            
            // Return error  in case of unavailable order
            if(!isAvailableOrder){
                let response = new generateResponse(true, req.safeBody.products, {
                    errorReason: customErrors.clientError.unavailableOrder
                });
                return res.status(response.STATUS_CODE).send(response);
            }
            
            newOrder['user_id'] = req.user._id;
            newOrder['products'] = req.safeBody.products;
            newOrder['total_price'] = req.safeBody.total_price;

            let saved = await newOrder.save();
            let response = new generateResponse(false, saved);
            
            return res.status(response.STATUS_CODE).send(response);

        } catch(error){
            const response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }
    });
}