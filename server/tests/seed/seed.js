const {ObjectId} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');
const user1id = new ObjectId();
const user2id = new ObjectId();
const users = [
    {
        _id:user1id,
        email:'usr1@email.com',
        password:'user1pass',
        tokens:[{
            access:'auth',
            token:jwt.sign({_id:user1id.toHexString(),access:'auth'},process.env.JWT_SECRET).toString()}
        ]
    },
    {
        _id:user2id,
        email:'usr2@email.com',
        password:'user2pass',
        tokens:[{
            access:'auth',
            token:jwt.sign({_id:user2id.toHexString(),access:'auth'},process.env.JWT_SECRET).toString()}
        ]
    }
]
const todos = [{text:'workout',_id:new ObjectId(),_creator:user1id},{text:'meditate',_id:new ObjectId(),completed:true,completedAt:333,_creator:user2id},{text:'study for exam',_id:new ObjectId(),_creator:user1id}];
const populateTodos =  (done)=>{
    Todo.remove({}).then(()=> Todo.insertMany(todos)).then(()=>done()).catch(err => done(err));
}

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        let user1 = new User(users[0]).save();
        let user2 = new User(users[1]).save();
        return Promise.all([user1,user2])
    }).then(()=>done());
}
module.exports = {todos,populateTodos,users,populateUsers};
