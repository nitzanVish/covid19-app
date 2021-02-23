
const Cart = require('../../models/CartModel');
const customErrors = require('../services/errors');
const generateResponse = require('../services/response/generateResponse');
const cartValidation = require('./cartValidation');
const validation = require('../services/validation');
const Product = require('../../models/productModel');


module.exports =  function(app){
    // Get user cart
    app.get('/api/cart',  async function(req, res, next){ 
        try {
            const cart = new Cart();
            const userCart = await cart.getCart(req.user._id);
            const response = new generateResponse(false, userCart);
            return res.status(response.STATUS_CODE).send(response);

        } catch(error){
            console.log(error);
            const response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }

    });
    
    // update product's qty in cart (from cart page)
    app.post('/api/cart/product', cartValidation.inputValidation(['product._id']), async function(req, res){
        
        try{
            let validationErr = validation.checkValidation(req);
            // validation error
            if(validationErr){
                return res.status(validationErr.STATUS_CODE).send(validationErr);
            }
            
            const cart = new Cart();

            //Get selected product
            const selectedProduct = await Product.findById(req.body.product._id);

            // Get available quantity
            let availableQty = cart.isQuantityAvailable(req.body.product.selectedQuantity, selectedProduct.quantity);
            
            let updatedCart = {};
            
            //check if product is available
            if(!availableQty.error){
                // update product's qty in cart
                updatedCart = await cart.updateProductQtyInCart(req.user._id, req.body.product);
            }

            let error = (updatedCart.user_id != undefined ) ? false : true;
            
            const response = new generateResponse(error, updatedCart, {
                errorReason: customErrors.clientError.quantityError
            });
            return res.status(response.STATUS_CODE).send(response);

        }  catch (error){
            console.log(error);
            let response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response); 
        }
    });

    // Add product to cart (from product page)
    // if cart already exists, check if this product was added, then add new qty to current
    // if cart is not exists, create new cart
    const bodyParamsPost = ['selectedQuantity', 'product_id'];
    app.post('/api/cart', cartValidation.inputValidation(bodyParamsPost), async function(req, res){
        try {

            let validationErr = validation.checkValidation(req);
            // validation error
            if(validationErr){
                return res.status(validationErr.STATUS_CODE).send(validationErr);
            }
            
            const cart = new Cart();

            // Get selected product
            const selectedProduct = await Product.findById(req.body.product_id);

            // Get available quantity
            let availableQty = cart.isQuantityAvailable(req.body.selectedQuantity, selectedProduct.quantity);
            
            // Return error in case of this product is out of stock 
            if(availableQty.availableQty == 0){
                let response = new generateResponse(true, {products: selectedProduct, addedQty:0}, {
                    errorReason: customErrors.clientError.requested_quantity
                        
                });
                return res.status(response.STATUS_CODE).send(response);
            }
            // check if cart exists 
            const currentCart = await cart.getCart(req.user._id);

            if(currentCart){
                // Add product to current cart
                let products = await cart.addingProductToCurrentCart(currentCart, availableQty.availableQty, selectedProduct);
                //let response = new generateResponse(availableQty.error, {products:products, availableQty:availableQty});
                
                let response = new generateResponse(availableQty.error, 
                    { products:products, addedQty :availableQty.availableQty, reqQty:req.body.selectedQuantity }, 
                    { errorReason: customErrors.clientError.requested_quantity }
                );

                return res.status(response.STATUS_CODE).send(response); 
            }
            else{
                //Create a new cart
                const newCart = Cart({
                    user_id: req.user._id,
                    products: [
                        {
                            selectedQuantity: req.body.selectedQuantity,
                            product_id: req.body.product_id
                        },
                    ]
                });
            
                let saved = await newCart.save();
                let response = new generateResponse(availableQty.error, 
                    { products:saved, addedQty :availableQty.availableQty, reqQty:req.body.selectedQuantity }, 
                    { errorReason: customErrors.clientError.requested_quantity }
                );

                return res.status(response.STATUS_CODE).send(response); 
            }

        } catch (error){
            console.log(error);
            let response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response); 
        }
    });

    // Delete ordered products from cart
    app.put('/api/cart', async function(req, res){
        
        if(req.body.orderProducts.length > 0){
            const cart = new Cart();
            let updatecart = await cart.updateCart(req);
            
            let response = new generateResponse(false, updatecart);
            return res.status(response.STATUS_CODE).send(response);
            
        } else {
            let response = new generateResponse(true, null, {
                errorReason: customErrors.clientError.emptyOrder
            });
            return res.status(response.STATUS_CODE).send(response);
        }

    });

    //Remove product from cart
    app.delete('/api/cart/product', cartValidation.inputValidation(['product_id']), async function(req, res){
        try{
            let validationErr = validation.checkValidation(req);
            // validation error
            if(validationErr){
                return res.status(validationErr.STATUS_CODE).send(validationErr);
            }

            const cart = new Cart();
            const currentCart = await cart.getCart(req.user._id);
            //if cart exists delete product
            if(currentCart){
                let filteredProducts = await cart.deleteProductFromCart(currentCart, req.body);
                let response = new generateResponse(false, filteredProducts);
                return res.status(response.STATUS_CODE).send(response);
            }
            
        } catch(error){
            console.log(error);
            let response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response); 
        }

    });

    // delete user's cart
    app.delete('/api/cart', async function(req, res){
        try{
            let deletedCart = await Cart.findOneAndDelete({user_id: req.user._id});
            let response = new generateResponse(false, deletedCart);
            return res.status(response.STATUS_CODE).send(response);

        } catch(error){
            console.log(error);
            let response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response); 
        }   

    })

}

