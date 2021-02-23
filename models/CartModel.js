const mongoose = require('mongoose');
const User = require('./userModel');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user_id: { 
        type: Schema.ObjectId,
        ref: 'User',
    },
    session_id: { 
        type: String 
    },
    products:[
        {
            selectedQuantity:{
                type: Number,
                required: true
            },
            product_id:{
                type: Schema.ObjectId,
                ref: 'Product',
                required: true 
            }
        }
    ]
});

// update product's qty in cart
CartSchema.methods.updateProductQtyInCart = async function (userId, product) {
    const currentCart = await Cart.findOne({user_id: userId});
    if(currentCart){
        for(let prod in currentCart.products){
            if(currentCart.products[prod].product_id == product._id){
                currentCart.products[prod].selectedQuantity = product.selectedQuantity;
                await currentCart.save();
                break;     
            }
        }
        return currentCart;

    } else {
        return false;
    }
    
}

// Get cart with category id
CartSchema.methods.getCart = function(userId){
    return new Promise(async function(resolve, reject){

        await Cart.findOne({user_id: userId})
        //deep population (populate a populated field)
        .populate({
            path : 'products.product_id',
            populate : {
                path : 'category_id'
            }
        })
        .exec(function (err, cart) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve(cart);
        });
    });


}

//Remove product from cart
CartSchema.methods.deleteProductFromCart = async function(currentCart, bodyParams){

    currentCart.products = currentCart.products.filter(item => {
        if(item.product_id._id != bodyParams.product_id){
            return true;
        } else {
            return false;
        }
    });

    if(currentCart.products.length > 0){
        await currentCart.save();
    } else {
        await currentCart.delete();
    }
    return currentCart;
}

//Update cart after ordered
// Delete ordered products from cart
CartSchema.methods.updateCart = async function(req){

    const currentCart = await this.getCart(req.user._id);

    req.body.orderProducts.forEach(reqProduct =>{
        for(let product in currentCart.products){
            if(reqProduct._id == currentCart.products[product].product_id._id){
                //if ordered products qty is equal to cart, remove this prod from cart
                if(reqProduct.selectedQuantity == currentCart.products[product].selectedQuantity){
                    // remove from cart
                    currentCart.products.splice(product, 1);
                    // if ordered products qty is lower than cart, update qty in cart
                } else if (reqProduct.selectedQuantity < currentCart.products[product].selectedQuantity) {
                    currentCart.products[product].selectedQuantity -= reqProduct.selectedQuantity;
                }
            }
        }
    });
    // Delete cart if it's empty
    if(currentCart.products.length > 0){
        await currentCart.save();
    } else {
        await currentCart.delete();
    }
    return currentCart;
}

// Add product to exists cart
CartSchema.methods.addingProductToCurrentCart = async function(currentCart, selectedQty, selectedProd){
    //check if item already exists, if true, adding req quantity to current qty 
    let isItemExists = false;
    
    // used for loop instead of forEach loop in order to break the loop
    for(let item = 0 ; item < currentCart.products.length; item++){
        isItemExists = false;
        if(currentCart.products[item].product_id._id == selectedProd._id.toString()){
            isItemExists = true;
            currentCart.products[item].selectedQuantity += Number(selectedQty);
            break;
        }
    }
    // if item isn't exists, adding it 
    if (!isItemExists){
        currentCart.products.push({
            selectedQuantity:selectedQty,
            product_id: selectedProd
        });
    }

    await currentCart.save();
    return currentCart;
}

//Get available qty
CartSchema.methods.isQuantityAvailable = function (requireQty, inventory) {
    
    let availableQty = 0;
    let error = false;

    if (requireQty <= inventory){
        availableQty = requireQty;
        error = false;
    } else if(inventory != 0) {
        availableQty = inventory;
        error = true;
    } else {
        availableQty = 0;
        error = true;
    }
    return{
        error:error,
        availableQty: availableQty
    }
}

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
