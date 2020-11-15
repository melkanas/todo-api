const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const {Todo} = require('../models/todo');


beforeEach((done)=>{
    Todo.remove({}).then(()=>done())
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
                Todo.find().then(todos => {
                    expect(todos[0].text).toBe(text);
                    done();
                    
                }).catch(err => done(err));
            });
    });
})