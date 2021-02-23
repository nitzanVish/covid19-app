const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user_id: { 
        type: Schema.ObjectId,
        ref: 'User',
        required: true 
    },
    products:{
        type: Array,
        required: true
    },
    total_price:{
        type:Number,
        required: true
    }
});


//Check if req quantity is available & correctness of req price
OrderSchema.methods.isAvailableOrder = async function(availableProducts, req){

    let isAvailable = true;
    let reqProducts = req.products;
    let totalPrice = 0;

    for(let reqProd in reqProducts) {
        isAvailable = true;
        for(let avProd in availableProducts){
            if(reqProducts[reqProd]._id == availableProducts[avProd]._id){
                
                if(!this.isAvailableQty(reqProducts[reqProd].selectedQuantity, availableProducts[avProd].quantity)){
                    isAvailable = false;
                } else {
                    totalPrice += reqProducts[reqProd].selectedQuantity * availableProducts[avProd].price;
                }
                break;
            }
        }
        if(!isAvailable){
            break;
        }
    };
    
    let isMatchingPrice = (req.total_price == totalPrice) ? true : false;

    return isAvailable && isMatchingPrice ? true : false;
}

OrderSchema.methods.isAvailableQty = function(reqQty, inventory){
    return reqQty > inventory ? false : true;
}

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;