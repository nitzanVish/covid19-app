
const Product = require('../../models/productModel');
const customErrors = require('../services/errors');
const generateResponse = require('../services/response/generateResponse');

module.exports = function(app){
    
    // Get products
    app.get('/api/products', async function(req, res, next){
        try {
            const products = await Product.find().populate('category_id');
            const response = new generateResponse(false, products);
            return res.cookie('auth',req.user.token, {httpOnly: true}).status(response.STATUS_CODE).send(response);
        } catch(error){
            console.log(error);
            const response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }
    });
    
    // Update ordered product's qty 
    app.post('/api/products', async function(req, res, next){
        
        if(req.body.orderedProducts && req.body.orderedProducts.length > 0 ){

            let products = new Product;
            await products.updateProdQty(req.body.orderedProducts);
            
            //Return updated products (in order to present updated product's qty)
            const productsList = await Product.find().populate('category_id');
            const response = new generateResponse(false, productsList);
            return res.cookie('auth',req.user.token, {httpOnly: true}).status(response.STATUS_CODE).send(response);

        } else {
            console.log(error);
            const response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }

    });

    // Get product by id
    app.get('/api/product/:product_id', async function(req, res, next){
        try {
            const product = await Product.findById(req.params.product_id).populate('category_id');
            const response = new generateResponse(false, product);
            return res.cookie('auth',req.user.token, {httpOnly: true}).status(response.STATUS_CODE).send(response);
        } catch(error){
            console.log(error);
            const response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }
    });
}