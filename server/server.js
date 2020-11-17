
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongoDb');
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
        .catch(err => res.status(400).send({error:'internal error'}));
})

app.listen(port,()=> console.log('app listening on port: ',port));

module.exports = {app};
