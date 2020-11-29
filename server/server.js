require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

let port = process.env.PORT;

const app = express();
app.use(bodyParser.json());

app.post('/todos',authenticate,(req,res)=>{
    let task = new Todo({text:req.body.text,_creator:req.user._id});

    task.save()
        .then(doc => res.send(doc))
        .catch(err => res.status(400).send(err));
});

app.delete('/todos/:id',(req,res)=>{
    let {id} = req.params;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    Todo.findByIdAndDelete(id)
        .then((doc)=>{
         if(!doc)
            return res.status(404).send();
        res.status(200).send({todo:doc});
    })
    .catch(err => res.status(400).send());
});

app.get('/todos',authenticate,(req,res)=>{
    Todo.find({_creator:req.user._id})
    .then(docs => res.send({todos:docs})).catch(err => res.status(400).send(err));
});

app.get('/todos/:id',(req,res)=>{
    let {id} = req.params;
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    Todo.findById(id)
        .then(docs => {
            if(!docs)
                return res.status(404).send();
            res.status(200).send({todo:docs})
        })
        .catch(err => res.status(404).send({error:'internal error'}));
})

app.patch('/todos/:id',(req,res)=>{
    let {id} = req.params;
    let body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    if(_.isBoolean(body.completed) && body.completed)
        body.completedAt = new Date().getTime();
    else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((doc)=>{
        if(!doc)
           return res.status(404).send()

        res.send({todo:doc})
    }).catch(e=> res.status(404).send());
})

// Users routes
//users signup
app.post('/users',(req,res)=>{
    let body = _.pick(req.body,['email','password']);
    let user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token)=>{
            res.header('x-auth',token).send(user)
        })
        .catch(err => res.status(400).send(err));
});



app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
})


app.post('/users/login',(req,res)=>{
    let body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then(user=>{
        return user.generateAuthToken().then(token=>{
            res.header('x-auth',token).send(user);
        })
    })
    .catch(err=>{
        res.status(400).send(err);
    })
}
);
//logout user
app.delete('/users/me/token',authenticate,(req,res)=>{
    let token = req.header('x-auth');
    req.user.removeToken(token).then(result=>{
        res.status(200).send({message:'logged out successfully'})
    }).catch(e=> res.status(400).send());
})
app.listen(port,()=> console.log('app listening on port: ',port));

module.exports = {app};
