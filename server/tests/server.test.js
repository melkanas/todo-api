const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const {app} = require('../server');
const {Todo} = require('../models/todo');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');
const { User } = require('../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);
after(app.close)

describe('POST-todos',()=>{
    it('should create a new todo in the database',(done)=>{
        let text = 'buy the desk';

        request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res) => expect(res.body.todos.map(elt => elt.text)).toEqual(todos.filter(todo=> (todo._creator == users[0]._id) ).map(elt=> elt.text)))
        .end(done);
    })
});

describe('get /todos/:id',()=>{
    
    it('should return a doc',(done)=>{
        let id = todos[0]._id
        request(app)
        .get('/todos/'+id.toHexString())
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res) => expect(res.body.todo.text).toBe(todos[0].text))
        .end(done);
    });

    it('should return a 404 if todo not found',(done)=>{
        let id = new ObjectId();
        request(app)
        .get('/todos/'+id.toHexString())
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
    
    it('should return a 404 for non object ids',(done)=>{
        request(app)
        .get('/todos/123')
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done)
        
    });

    it('should not return a doc created by other users',(done)=>{
        let id = todos[1]._id
        request(app)
        .get('/todos/'+id.toHexString())
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('delete /todos/:id',()=>{
    it('should delete the first todo from database',(done)=>{
        let id = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non object ids',(done)=>{
        request(app)
        .delete('/todos/123')
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should not delete another users todo',(done)=>{
        let id = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end((err,res) => {
            if(err)
                return done(err);
            Todo.findById(id).then(todos => {
                expect(todos).toExist();
                done();
            }).catch(err => done(err));
        });

    });

});

describe('patch /todos/:id',()=>{
    it('should update the todo',(done)=>{
        let id = todos[0]._id.toHexString();
        let update = {text:'run',completed:true};
        request(app)
        .patch('/todos/'+id)
        .set('x-auth',users[0].tokens[0].token)
        .send(update)
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe(update.text);
            expect(res.body.todo.completed).toBe(update.completed);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done)
    });

    it('should not update other users todo',(done)=>{
        let id = todos[0]._id.toHexString();
        let update = {text:'run',completed:true};
        request(app)
        .patch('/todos/'+id)
        .set('x-auth',users[1].tokens[0].token)
        .send(update)
        .expect(404)
        .end(done)
    });

    it('should clear completedAt when todo is not completed',(done)=>{
        let id = todos[0]._id.toHexString();
        let update = {completed:false};
        request(app)
        .patch('/todos/'+id)
        .set('x-auth',users[0].tokens[0].token)
        .send(update)
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done)
    });


});

describe('get users/me',()=>{
    it('should return user if authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect(res=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect(res=>expect(res.body).toEqual({}))
        .end(done);
    })
});

describe('post /users',()=>{
    it('should create a user',(done)=>{
        let newuser = {
            email:'newuser@email.com',
            password:'newusrpass'
        };
        request(app)
        .post('/users')
        .send(newuser)
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toExist();
        })
        .end((err)=>{
            if(err)
                return done(err);
            User.findOne({email:newuser.email}).then(user=> {
                expect(user).toExist();
                done();
            }).catch(e=>done(e));
        });
    });
    it('should return validation errors if request invalid',(done)=>{
        request(app)
        .post('/users')
        .send({email:'invalidemail',password:'passwrd'})
        .expect(400)
        .end(done);
    });
    it('should not create user if email in use',(done)=>{
        request(app)
        .post('/users')
        .send({email:users[0].email,password:'passwrd'})
        .expect(400)
        .end(done);
    })
});

describe('Post users/login',()=>{
    it('should login users with correct credentials',(done)=>{
        request(app)
        .post('/users/login')
        .send({email:users[1].email,password:users[1].password})
        .expect(200)
        .expect(res=>{
            expect(res.headers['x-auth']).toExist();
        })
        .end((err,res)=>{
            if(err)
                return done(err);
            User.findById(users[1]._id).then(doc=>{
                expect(doc.tokens[1]).toContain({
                    access:'auth',
                    token:res.headers['x-auth']
                })
                done();
            }).catch(err=>done(err));
        });

    });
});
describe('DELETE users/me/token',()=>{
    it('should remove auth token on logout',(done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect(res => expect(res.body).toContain({message:'logged out successfully'}))
        .end((err,res)=>{
            if(err)
                return done(err);
            User.findById(users[0]._id.toHexString()).then(doc =>{
                expect(doc.tokens.length).toBe(0);
                done();
            }).catch(err=>done(err));
        });
    });
})