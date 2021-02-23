
import axios from '../../services/axios';

const state = {
    order:[]
}

const getters = {
    getOrder(state){
        return state.order;
    }
}

const actions = {
     // Add Order 
    addOrder({commit}, cartDetails){
        
        let data = {
            products: cartDetails.products,
            total_price: cartDetails.total_price
        
        };
        
        return new Promise((resolve, reject)=> {
            axios({
                method: 'post',
                url: 'api/order',
                data: data,
                contentType: "application/json",
            })
            .then(function (response) {
                commit('setOrder', response.data.DATA);
                return resolve(response);
            })
            .catch(function(err){
                console.log(err);
                return reject(err);
            });
        });
    }
}

const mutations = {
    setOrder(state, newOrder){
        state.order = newOrder;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
