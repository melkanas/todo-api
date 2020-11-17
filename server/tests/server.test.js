const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const {Todo} = require('../models/todo');

let todos = [{text:'workout'},{text:'meditate'},{text:'study for exam'}];
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
        .expect((res) => expect(res.body.todos.map(elt=>{
            let obj ={};
            obj.text = elt.text;
            return obj;
        })).toEqual(todos))
        .end(done);
    })
})