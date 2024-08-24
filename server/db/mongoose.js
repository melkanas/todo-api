const mongoose = require('mongoose');
require('dotenv').config(); // env variables

const uri = process.env.ATLAS_URI;
mongoose.Promise = global.Promise;

mongoose.connect(uri,{ useNewUrlParser: true,useUnifiedTopology:true }).catch(err => console.log(err));

module.exports = {mongoose};