const axios = require('axios');
const generateResponse = require('../services/response/generateResponse');
const geoip = require('geoip-lite');

module.exports = function(app){

    //get country ip
    const countryByIp = function () {
            
        const ip = "77.126.13.63";
        let geo = geoip.lookup(ip);
        console.log('geo', geo);
        // defined default value for geo
        geo = '';
        geo = geo ? geo : 'Israel';
        console.log('geo', geo);
        return geo;
    }

    // Get corona status by ip
    app.get('/api/coronaStatusByIp',  async function(req, res, next){ 
        try {
            const coronaStatus = {
                method: 'GET',
                url: 'https://coronavirus-map.p.rapidapi.com/v1/summary/region',
                params: {region: countryByIp()},
                headers: {
                    'x-rapidapi-key': '13f7cf6141mshee96ff91b5cfad7p1e34ddjsn1367db86f97a'
                }
            };

            let axiosRes = await axios.request(coronaStatus);
        
            let err = (axiosRes.status == 200) ? false : true;
            let data = (axiosRes.data != undefined) ? axiosRes.data : '';
            if(data){
                data.data.summary.countryNameByIp = 'Israel'; //send country name to vue
            }

            const response = new generateResponse(err, data);
            return res.status(response.STATUS_CODE).send(response);

        } catch(error){
            console.log(error);
            const response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }

    });

    // Get last week corona status by ip
    app.get('/api/coronaLastWeekStatus',  async function(req, res, next){ 
        try {
            const coronaLastWeekStatus = {
                method: 'GET',
                url: 'https://coronavirus-map.p.rapidapi.com/v1/spots/week',
                params: {region: countryByIp()},
                headers: {
                    'x-rapidapi-key': '13f7cf6141mshee96ff91b5cfad7p1e34ddjsn1367db86f97a'
                }
            };

            let axiosRes = await axios.request(coronaLastWeekStatus);
            
            return res.send(axiosRes.data);

        } catch(error){
            console.log(error);
            const response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }
    });

    // Get corona status in all countries
    app.get('/api/coronaAllCountries',  async function(req, res, next){ 
        try {
            const coronaAllCountries = {
                method: 'GET',
                url: 'https://coronavirus-map.p.rapidapi.com/v1/summary/latest',
                headers: {
                    'x-rapidapi-key': '13f7cf6141mshee96ff91b5cfad7p1e34ddjsn1367db86f97a'
                }
            };

            let axiosRes = await axios.request(coronaAllCountries);
            
            return res.send(axiosRes.data);

        } catch(error){
            console.log(error);
            const response = new generateResponse(true, null);
            return res.status(response.STATUS_CODE).send(response);
        }
    })

}