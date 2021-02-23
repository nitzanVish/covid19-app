

const mongoose = require('mongoose');
const User = require('./userModel');
const Category = require('./categoryModel');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    seller_id: { 
        type: Schema.ObjectId,
        ref: 'User',
        required: true 
    },
    quantity:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: Number,
        required: false
    },
    favorite:{
        type: Boolean,
        default: false 
    },
    category_id:{
        type: Schema.ObjectId,
        ref: 'Category'
    },
    image:String,
    currency:{
        type: String,
        required: true
    }
});

//// Update ordered products qty 
ProductSchema.methods.updateProdQty = async function(products){
    products.forEach(async product => {
        let dbProduct = await Product.findById(product._id);
        if(dbProduct.quantity > 0){
            dbProduct.quantity -= product.selectedQuantity;
            await dbProduct.save();
        }

    });
}


var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;