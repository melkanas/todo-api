const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    let task = new Todo({text:req.body.text});

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

app.get('/todos',(req,res)=>{
    Todo.find().then(docs => res.send({todos:docs})).catch(err => res.status(400).send(err));
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
app.listen(port,()=> console.log('app listening on port: ',port));

module.exports = {app};
