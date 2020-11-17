const mongoose = require('mongoose');
require('dotenv').config(); // env variables

const uri = process.env.ATLAS_URI || 'mongodb://localhost:27017/TodoAPI-DB'
mongoose.Promise = global.Promise;

mongoose.connect(uri,{ useNewUrlParser: true,useUnifiedTopology:true }).catch(err => console.log(err));

module.exports = {mongoose};