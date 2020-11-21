const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
// let password = 'pas13-@john';

// let hashpass = SHA256(password).toString();
let data = {id:10};

let token = jwt.sign(data,'thisisthesecret');

let decoded = jwt.verify(token,'thisisthesecret')
console.log(token);
console.log('decoded: ',decoded);