const {MongoClient,ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp'
MongoClient.connect(url,(err,client)=>{
    if(err)
        return console.log('unable to connect to mongodb server');

    console.log('successfully connected to mongodb server');

    const db = client.db('TodoApp');

    //db.collection('Todos').deleteMany({task:'test backend'}).then(res => console.log(res));
    //db.collection('Todos').deleteOne({text:'defeat Kaido'}).then(res => console.log(res));
    //db.collection('Todos').findOneAndDelete({"_id":new ObjectID("5fafe7dede010c35507d3be3")}).then(res => console.log(res));
})