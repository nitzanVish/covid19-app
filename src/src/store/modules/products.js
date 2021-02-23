
import axios from '../../services/axios';

const state = {
    products:[],
    product:{}
}

const getters = {
    getProducts(state){
        return state.products;
    },
    getProduct(state){
        return state.product;
    }
}

const actions = {

// Update ordered product's qty 
    updateProductsQty({commit},items){
        return new Promise((resolve)=> {
            axios({
                method: 'post',
                url: `api/products`,
                data: {orderedProducts: items}
            })
            .then(function (response) {
                commit('setProducts', response.data.DATA);
                return resolve(response);
            })
        });
    },
    // Get products
    dbProducts({commit}){
        return new Promise((resolve)=> {
            axios({
                method: 'get',
                url: `api/products`
            })
            .then(function (response) {
                commit('setProducts', response.data.DATA);
                return resolve(response);
            })
        });
    },
    // Get product by id
    getProduct({commit}, id){
        return new Promise((resolve)=> {
            axios({
                method: 'get',
                url: `api/product/${id}`
            })
            .then(function (response) {
                commit('setProduct', response.data.DATA);
                return resolve(response);
            })
        });
    }

}

const mutations = {
    setProducts(state, products){
        state.products = products;
    },
    setProduct(state, product){
        state.product = product;
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
