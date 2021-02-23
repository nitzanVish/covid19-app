import axios from '../../services/axios';

const state = {
    user: {},
    setUserObj: function(value = {}){
        this.user = {
            email: (Object.prototype.hasOwnProperty.call(value, 'email')) ? value.email : '',
            name: (Object.prototype.hasOwnProperty.call(value, 'name')) ? value.name : '',
            address: (Object.prototype.hasOwnProperty.call(value, 'address')) ? value.address : '',
            phoneNumber: (Object.prototype.hasOwnProperty.call(value, 'phoneNumber')) ? value.phoneNumber : '',
            gender: (Object.prototype.hasOwnProperty.call(value, 'gender')) ? value.gender : '',
        }
    }

}
// Set user properties before login
state.setUserObj();

const getters = {
    isLoggedIn: function(state){
        return (state.user.name.length > 0) ? true : false;
    },
    getUser: function(state){
        return (state.user.name.length > 0) ? state.user : false;
    }

}

const actions = {

    logout: function({commit}){
        return new Promise((resolve, reject)=> {
            axios({
                method: 'delete',
                url: 'user/logout'
            })
            .then(function (response) {
                commit('setUserState', {});
                return resolve(response);
            })
            .catch(function(err){
                console.log(err);
                return reject(err);
            });
        });
    },
    signIn: function ({commit}, userInputs) {
        console.log(userInputs);
            return new Promise((resolve, reject)=> {
                axios({
                    method: 'post',
                    url: 'user/signin',
                    data: userInputs
                })
                .then(function (response) {
                    commit('setUserState', response.data.DATA);
                    return resolve(response);
                })
                .catch(function(err){
                    console.log(err);
                    return reject(err);
                });
            });
    },
    //Create a new user or update user 
    addOrUpdateUser: function ({commit}, userInputs) {
        return new Promise((resolve, reject)=> {
            axios({
                method: 'post',
                url: `user/${userInputs.url}`,
                data: userInputs.data
            })
            .then(function (response) {
                commit('setUserState', response.data.DATA);
                return resolve(response);
            })
            .catch(function(err){
                console.log(err);
                return reject(err);
            });
        });
    },
}

const mutations = {
    setUserState: function(state, setUser){
        let data = (setUser) ? setUser : {};
        state.setUserObj(data);
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
