const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


 let password = 'pas13-@john';
 bcrypt.genSalt(10,(err,salt)=>{
     bcrypt.hash(password,salt,(err,hash)=>console.log('salt: ' + salt+'\nhash :'+ hash));
 });
let hashedpass = "$2a$10$wN0PFVrVUQOOByFrpUSk8OyOqcwRxtr6qQpYwe0HsvK.KNNBa5HJi";

bcrypt.compare(password,hashedpass,(err,res)=>console.log(res));






// let hashpass = SHA256(password).toString();
// let data = {id:10};

// let token = jwt.sign(data,'thisisthesecret');

// let decoded = jwt.verify(token,'thisisthesecret')
// console.log(token);
// console.log('decoded: ',decoded);