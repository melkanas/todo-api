const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongoDb');
const {app} = require('../server');
const {Todo} = require('../models/todo');

let todos = [{text:'workout',_id:new ObjectId()},{text:'meditate',_id:new ObjectId()},{text:'study for exam',_id:new ObjectId()}];
beforeEach((done)=>{
    Todo.remove({}).then(()=> Todo.insertMany(todos)).then(()=>done()).catch(err => done(err));
});


describe('POST-todos',()=>{
    it('should create a new todo in the database',(done)=>{
        let text = 'buy the desk';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>expect(res.body.text).toBe(text))
            .end((err,res) => {
                if(err)
                    return done(err);
                Todo.find({text}).then(todos => {
                    expect(todos[0].text).toBe(text);
                    done();
                    
                }).catch(err => done(err));
            });
    });
});

describe('GET todos',()=>{
    it('should get all todos array',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => expect(res.body.todos.map(elt => elt.text)).toEqual(todos.map(elt=>elt.text)))
        .end(done);
    })
});

describe('get /todos/:id',()=>{
    
    it('should return a doc',(done)=>{
        let id = todos[0]._id
        request(app)
        .get('/todos/'+id.toHexString())
        .expect(200)
        .expect((res) => expect(res.body.todo.text).toBe(todos[0].text))
        .end(done);
    });

    it('should return a 404 if todo not found',(done)=>{
        let id = new ObjectId();
        request(app)
        .get('/todos/'+id.toHexString())
        .expect(404)
        .end(done);
    });
    
    it('should return a 404 for non object ids',(done)=>{
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done)
        
    });
})