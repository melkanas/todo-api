
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
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


app.listen(port,()=> console.log('app listening on port: ',port));

module.exports = {app};
