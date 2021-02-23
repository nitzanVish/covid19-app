var config = require('../default.json');

var mongoose = require('mongoose');

    function getDbConnectionString (){
        return 'mongodb+srv://'+ config.db.user + ':' + config.db.pwd +
        '@cluster0.spszu.gcp.mongodb.net/ShopaHolic?retryWrites=true&w=majority';
    }

module.exports = {
    //connection to mongodb
    getDbConnection: async function(){
        try {
            await mongoose.connect(getDbConnectionString());
        } catch(error){
            console.log(error);
        }
    }
}
