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
    let users = [{username:'Aokiji',birthdate:new Date(1985,5,15)},{username:'Naruto',birthdate:new Date(1999,5,15)},{username:'Luffy',birthdate:new Date(1999,5,15)}];
    let tasks = [{text:"defeat Madara", completed:true},{text:"defeat Kaido", completed:false},{text:"stop world government plans", completed:false}];
    // db.collection('Users').insertMany(users,(err,res)=>{
    //     if(err)
    //         return console.log('unable to insert user to Users collection');
    //     console.log(JSON.stringify(res.ops,undefined,2));
    // });
    db.collection('Todos').insertMany(tasks,(err,res)=>{
        if(err)
            return console.log('unable to write to Todos',err);
        console.log(JSON.stringify(res.ops,undefined,2));
    });
    client.close();
})