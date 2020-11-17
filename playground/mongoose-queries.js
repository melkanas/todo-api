const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongoDb');


// let id = "5fb3b2980391f94c3a695f92";

// if( !ObjectID.isValid(id) )
//     return console.log('invalid ID');

// Todo.find({_id:id})
//     .then(docs => console.log('find:',docs))
//     .catch(err => console.log(err));

// Todo.findOne({_id:id})
//     .then(docs => console.log('findOne:',docs))
//     .catch(err => console.log(err));

// Todo.findById(id)
//     .then(docs => console.log('findById:',docs))
//     .catch(err => console.log('invalid Id',err));
let userId = "5fb3bdeb087a6d54440eb412";
User.findById(userId).then((docs)=>{
    if(!docs)
        return console.log('Id not found');
    console.log('findById',docs);
}).catch(err => console.log(err));