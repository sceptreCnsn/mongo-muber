const Driver = require('../models/driver');
module.exports = {
    greeting(req, res){
        res.send({hi:'there'});
    },

    create(req,res){
       console.log('Request: ',req.body);
       res.send({hi:'there'});
    }
};