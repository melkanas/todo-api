const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongodb');

//Todo.deleteMany({}).then((res)=>console.log(res)).catch(err => console.log(err));

Todo.findByIdAndDelete("5fb4394784fba7651fd86f6c").then(res => console.log(res)).catch(err => console.log(err));
Todo.findOneAndDelete({_id:"5fb4394784fba7651fd86f6c"}).then(res => console.log(res)).catch(err => console.log(err));