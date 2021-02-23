
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import auth from './modules/auth';
import products from './modules/products';
import cart from './modules/cart';
import order from './modules/order';

Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        auth,
        products,
        cart,
        order
    },
     plugins: [createPersistedState()] // Persist state between page reloads
})