const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongoDb');
const {app} = require('../server');
const {Todo} = require('../models/todo');

let todos = [{text:'workout',_id:new ObjectId()},{text:'meditate',_id:new ObjectId(),completed:true,completedAt:333},{text:'study for exam',_id:new ObjectId()}];
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
});

describe('delete /todos/:id',()=>{
    it('should delete the first todo from database',(done)=>{
        let id = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=>expect(res.body.todo._id).toBe(id))
        .end((err,res) => {
            if(err)
                return done(err);
            Todo.findById(id).then(todos => {
                expect(todos).toNotExist();
                done();
            }).catch(err => done(err));
        });

    });

    it('should return 404 if todo not found',(done)=>{
        let id = new ObjectId();
        request(app)
        .delete('/todos/'+id.toHexString())
        .expect(404)
        .end(done);
    });

    it('should return 404 for non object ids',(done)=>{
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    })

});

describe('patch /todos/:id',()=>{
    it('should update the todo',(done)=>{
        let id = todos[0]._id.toHexString();
        let update = {text:'run',completed:true};
        request(app)
        .patch('/todos/'+id)
        .send(update)
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe(update.text);
            expect(res.body.todo.completed).toBe(update.completed);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done)
    });

    it('should clear completedAt when todo is not completed',(done)=>{
        let id = todos[0]._id.toHexString();
        let update = {completed:false};
        request(app)
        .patch('/todos/'+id)
        .send(update)
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done)
    });


})