const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp'
MongoClient.connect(url,(err,client)=>{
    if(err)
        return console.log('unable to connect to mongodb server');

    console.log('successfully connected to mongodb server');

    const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({task:'test backend',completed:false},(err,res)=>{
    //     if(err)
    //         return console.log('unable to write to Todos',err);
    //     console.log(JSON.stringify(res.ops,undefined,2));
    // });
    db.collection('Users').insertOne({username:'Ben',birthdate:new Date(1997,5,15)},(err,res)=>{
        if(err)
            return console.log('unable to insert user to Users collection');
        console.log(JSON.stringify(res.ops,undefined,2));
    });
    client.close();
})