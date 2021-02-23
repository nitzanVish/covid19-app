
import axios from 'axios';
import router from '../router';

//Define basic url
const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    //'http://a937c0c4c345.ngrok.io', 
    withCredentials: true
});
//Navigation to error page in case of error
instance.interceptors.response.use(function (response) {
    return response;
    }, function (error) {
        if(router.currentRoute.name != 'error404'){
            router.push({name:'error404'});
        }
    return Promise.reject('error from interceptors'+ error);
    
});

export default instance;