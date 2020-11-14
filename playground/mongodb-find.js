const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp'
MongoClient.connect(url,(err,client)=>{
    if(err)
        return console.log('unable to connect to mongodb server');

    console.log('successfully connected to mongodb server');

    const db = client.db('TodoApp');
    // db.collection('Todos').find({completed:false}).toArray().then((docs)=>console.log(docs)).catch(err=>console.log('unable to fetch docs'));
    db.collection('Todos').find().count().then(tot=>console.log(tot)).catch(err=>console.log(err));
    let query = {birthdate:new Date(1996,5,15)};
    db.collection('Users').find(query).toArray().then(docs => console.log(docs)).catch(err => console.log(err));
})