import VueRouter from 'vue-router'
import Vue from 'vue'
import store from '../store/index';
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: () => import('../views/Home.vue'),
        name: 'HomePage',
    },
    {
        path: '/sign_in',
        component: () => import('../views/SignIn.vue'),
        name: 'signIn',
    },
    {
        path: '/sign_up',
        component: () => import('../views/SignUp.vue'),
        name: 'signUp',
    },
    {
        path: '/cart',
        component: () => import('../views/Cart.vue'),
        name: 'cart',
    },
    {
        path: '/products',
        component: () => import('../views/Products.vue'),
        name: 'products',
    },
    {
        path: '/product/:product_id',
        component: () => import('../views/Product.vue'),
        name: 'product',
        params: true
    },
    // {
    //     path: '/signIn_signUp',
    //     component: () => import('../views/SignInSignUp.vue'),
    //     name: 'SignInSignUp',
    // },
    {
        path: '/thank_you',
        component: () => import('../views/ThankYou.vue'),
        name: 'thankYou',
    },
    {
        path: '/user_profile',
        component:  () => import('../views/profile.vue'),
        name: 'userProfile',
        meta: { requiresAuth: true }
    },    
    {
        path: '/error_404',
        component: () => import('../views/404.vue'),
        name: 'error404',
    },
    {
        path: '/corona_status_table',
        component:  () => import('../views/Corona/StatusTable.vue'),
        name: 'coronaStatusTable',
        
    },  
    {
        path: '*',
        component: () => import('../views/Home.vue'),
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

//Check if auth is required before enter to any route
router.beforeEach( (to, from, next) => {
    const loggedIn = store.getters.isLoggedIn;
    if(to.matched.some(record => record.meta.requiresAuth)){
        if (!loggedIn) {
            next('/signIn_signUp');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;