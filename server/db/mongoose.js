const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/TodoApp'
mongoose.Promise = global.Promise;

mongoose.connect(url).catch(err => console.log(err));

module.exports = {mongoose};