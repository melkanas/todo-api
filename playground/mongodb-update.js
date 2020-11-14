const {MongoClient,ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp'
MongoClient.connect(url,(err,client)=>{
    if(err)
        return console.log('unable to connect to mongodb server');

    console.log('successfully connected to mongodb server');

    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({_id:new ObjectID("5fb03529dc42df35f4b853f1")},{$set:{text:'defeat otsutki clan'}},{returnOriginal:false}).then(res => console.log(res));
    db.collection('Users').findOneAndUpdate({_id:new ObjectID("5fafe9478b0a2e1ab0b02ff1")},{$currentDate:{birthdate:true}},{returnOriginal:false}).then(res => console.log(res));;
    
})