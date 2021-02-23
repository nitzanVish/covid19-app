import axios from '../../services/axios';

const state = {
    cart:[],
    unAvailableProducts:[],
    availableProducts:[],
    checkBoxItems:[],
}
// change obj structure
function changeObj(product){
    let newObj = {};
    let prodKeys = Object.keys(product);
        prodKeys.forEach(el => {
            if(typeof product[el] != 'object'){
                newObj[el] = product[el];
            } else {
                Object.assign(newObj, product[el]);
            }
        });
        return newObj;
}
const getters = {
    getUnAvailableProducts(state){
        let unavailableProd = [];
        if(state.unAvailableProducts && state.unAvailableProducts.length > 0){
            state.unAvailableProducts.forEach(product =>{
                unavailableProd.push(changeObj(product));
            });
        }
        return unavailableProd;
    },
    getAvailableProducts(state){
        
        let availableProd = [];
        if(state.availableProducts && state.availableProducts.length > 0){
            state.availableProducts.forEach(product =>{
                availableProd.push(changeObj(product));
            });
        }
        return availableProd;
    },
    cartQty(state){
        let totalItems = 0;
        if(state.cart.products){
            totalItems = state.cart.products.length;
        } 
        return totalItems;
    },
    getCartStore(state){
        return state.cart;
    },
    // Calc price
    getTotalPrice(state){
        let totalPrice = 0 ;
        if(state.checkBoxItems.length > 0){
            state.checkBoxItems.forEach(item =>{
                totalPrice += item.selectedQuantity * item.price; 
            });
        }
        return Math.ceil(totalPrice);
    },
    //Get the amount of check box Items
    getTotalItems(state){
        return state.checkBoxItems.length;
    },
    //Get check box Items
    getCheckBoxItems(state){
        return state.checkBoxItems;
    }

}

// Clone obj in order to change it and save the original.
function deepClone(obj){
    let newObj = {};
    if(typeof(obj) != 'object'){
        return obj;
    }
    for(let key in obj){
        if(typeof(obj[key]) == 'object'){
            newObj[key] = deepClone(obj[key]);
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

const actions = {
    // Change items in checkbox 
    changeBoxItems({commit}, items){
        commit('setCheckBoxItems', items);
    },
    // Add product to checkbox 
    addToCheckBoxItems({commit}, item){
        commit('addToCheckBoxItems', item);
    },
    // Delete product from checkbox 
    deleteFromCheckBoxItems({commit}, item){
        commit('deleteFromCheckBoxItems', item);
    },
    //sort product's array to available/unavailable arrays
    filterProducts({commit, state}){
        let availableProducts = [];
        let unAvailableProducts = [];
        let cloneProductsArr = [];
        if(state.cart.products && state.cart.products.length > 0){

            // clone products array
            state.cart.products.forEach(item =>{
                cloneProductsArr.push(deepClone(item));
            });

            cloneProductsArr.forEach(element => {
                
                if(element.selectedQuantity <= element.product_id.quantity ){
                    availableProducts.push(element);
                } else {
                    
                    if(element.product_id.quantity != 0){

                        let item = (element.product_id.quantity > 1) ? 'items' : 'item';
                        element.message = `Only ${element.product_id.quantity}  ${item} are available`;
                        element.selectedQuantity = element.product_id.quantity;
                        availableProducts.push(element);
                        
                    } else {
                        unAvailableProducts.push(element);
                    }
                }
            });
        }
        
        commit('setAvailableProducts', availableProducts);
        commit('setUnavailableProducts', unAvailableProducts);
    },

    // Get user cart
    getDbCart({commit}){
        return new Promise((resolve)=> {
            axios({
                method: 'get',
                url: `api/cart`
            })
            .then(function (response) {
                
                let data = (response.data.DATA) ? response.data.DATA : {};
                commit('setCart', data);
                return resolve(response);
            })
        });
    },

    // Add product to cart
    addProductToCart({commit}, product){
        let data = {
            "selectedQuantity":product.selectedQuantity,
            "product_id": product._id
        };
        console.log(data);
        return new Promise((resolve, reject)=> {
            axios({
                method: 'post',
                url: 'api/cart',
                data: data
            })
            .then(function (response) {
                commit('setCart', response.data.DATA.products);
                return resolve(response);
            })
            .catch(function(err){
                console.log(err);
                return reject(err);
            });
        });
    },

    // After order, delete products from cart
    updateCart({commit}, orderProducts){
        return new Promise((resolve, reject) => {
            axios({
                method: 'put',
                url: 'api/cart',
                data: {orderProducts: orderProducts}, 
                contentType: "application/json",
            })
            .then(function(response){
                // if cart is exists (after deleting products from cart)
                if(response.data.DATA && Object.prototype.hasOwnProperty.call(response.data.DATA,'products')){
                    commit('setCartProd', response.data.DATA.products);
                }
                return resolve(response);
            })
            .catch(function(err){
                console.log(err);
                return reject(err);
            });
        });
    },

    // Remove product from cart
    removeProductStore({commit}, product){
        return new Promise((resolve, reject) => {
            axios({
                method: 'delete',
                url: 'api/cart/product',
                data: {product_id: product._id}
            })
            .then(function (response) {
                let data = (response.data.DATA) ? response.data.DATA : {};
                commit('setCart',data);
                return resolve(response);
            })
            .catch(function(err){
                console.log(err);
                return reject(err);
            });
        })
    },

    // Delete user cart (in case of empty cart)
    deleteCart({state, commit}){
            axios({
                method: 'delete',
                url: 'api/cart',
                data: {cart_id : state.cart._id}
            })
            .then(function () {
                commit('setCart',{});
                commit('setAvailableProducts', []);
                commit('setUnavailableProducts', []);
            })
            .catch(function(err){
                console.log(err);
            });
    },
    // Clean cart's values in case of login or logout
    resetCart({commit}){
        commit('setCart',{});
        commit('setAvailableProducts', []);
        commit('setUnavailableProducts', []);
        commit('setCheckBoxItems', []);
    }
}

const mutations = {
    setCart(state, cart = {}){
        state.cart = cart;
    },
    setCartProd(state, products = []){
        if(state.cart.products && state.cart.products != undefined){
            state.cart.products = products;
        }
    },
    setAvailableProducts(state, availableProducts){
        state.availableProducts = availableProducts;
    },
    setUnavailableProducts(state, unAvailableProducts){
        state.unAvailableProducts = unAvailableProducts;
    },
    setCheckBoxItems(state, items){
        state.checkBoxItems = items;
    },
    addToCheckBoxItems(state, item){
        state.checkBoxItems.push(item);
    },
    deleteFromCheckBoxItems(state, item){
        state.checkBoxItems = state.checkBoxItems.filter(prod => prod._id != item._id);
    },
    
}

export default {
    state,
    getters,
    actions,
    mutations
}