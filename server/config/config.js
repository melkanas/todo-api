let env = process.env.NODE_ENV || 'development';
if(env === 'development'){
    process.env.PORT = 3000;
    process.env.ATLAS_URI = 'mongodb://localhost:27017/TodoAPI-DB';
}else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.ATLAS_URI = 'mongodb://localhost:27017/TodoAPI-DB-Test';
}
