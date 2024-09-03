import * as chai from 'chai';
import chaiHttp from 'chai-http';
import * as server from '../server.js';
chai.use(chaiHttp);

const { expect } = chai;

describe("Auth API", () => {
    
    let token = '';
    //Before running the tests, login to get a valid token
    before(async() => {
        const res = await chai.request(server)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'admin123' });
    
        token = res.body.token;
    });

    //REGISTER API
    // Test case for registering a new user (admin only)
    it('should register a new user', async()=>{
        const res = await chai.request(server)
            .post("/api/auth/register")
            .set('x-auth-token',token)
            .send({ username: "testuser", password: "password123", role: "admin" });
                expect(res).to.have.status(201);
                expect(res).to.be.an('object');
                expect(res.body.user).to.have.property('username').eql('testuser');
    });

    // Test case for unauthorized registration attempt
    it('should not register a new user without token', async() => {
        const res = await chai.request(server)
            .post('/api/auth/register')
            .send({ username: 'testuser2', password: 'password123', role: 'user' });
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('message').eql('Authorization Denied');
    });

    // Test case for invalid token during registration
    it('should not register a new user with invalid token', async() => {
        const res = await chai.request(server)
            .post('/api/auth/register')
            .set('x-auth-token', 'tokenInvalid')
            .send({ username: 'testuser3', password: 'password123', role: 'user' });
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('message').eql('Token Invalid');
    });

    // Test case for user role for new user registration
    it('should not register a new user without admin access', async() => {
        const res = await chai.request(server)
            .post('/api/auth/register')
            .set('x-auth-token', token)
            .send({ username: 'testuser4', password: 'password123', role: 'user' });
                expect(res).to.have.status(403);
                expect(res.body).to.have.property('message').eql('Admin access required');
    });

    //LOGIN API
    // Test case for a successful login
    it('should log in a user successfully with correct credentials', async() => {
        const res = await chai.request(server)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('token');
    });

    // Test case for login with incorrect password
    it('should not log in a user with incorrect password', async() => {
        const res = await chai.request(server)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'incorrectPassword' });
                expect(res).to.have.status(401);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Invalid Credentials');
    });

    // Test case for login with non-existent user
    it('should not log in a non-existent user', async() => {
        const res = await chai.request(server)
            .post('/api/auth/login')
            .send({ username: 'newuser', password: 'newpassword123' });
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('User not found');
    });

    // Test case for login with missing username
    it('should not log in a user with missing username', async() => {
        const res = await chai.request(server)
            .post('/api/auth/login')
            .send({ password: 'password123' });
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Please provide username');
    });

    // Test case for login with missing password
    it('should not log in a user with missing password', async() => {
        const res = await chai.request(server)
            .post('/api/auth/login')
            .send({ username: 'testuser' });
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Please provide password');
    });

    //LOGOUT API
    // Test case for successful logout
    it('should log out a user successfully', async() => {
        const res = await chai.request(server)
            .post('/api/auth/logout');
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Logged out');
    });

    // Test case for logout without a token
    it('should not log out a user without a token', async() => {
        const res = await chai.request(server)
            .post('/api/auth/logout');
                expect(res).to.have.status(401);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Authorization Denied');
    });

    // Test case for logout with an invalid token
    it('should not log out a user with an invalid token', async() => {
        const res = await chai.request(server)
            .post('/api/auth/logout')
            .set('x-auth-token', 'tokenInvalid');
                expect(res).to.have.status(401);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Token Invalid');
    });

    //EDIT USERS API
    it('should allow admin to update user details', async() => {
        const res = await chai.request(app)
            .put(`/api/users/someUserId`)
            .set('x-auth-token', token)
            .send({ username: 'testuser1', role: 'updatedRole' });
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('User updated successfully');
                expect(res.body.user).to.have.property('username').eql('testuser1');
                expect(res.body.user).to.have.property('role').eql('updatedRole');
    });

    //GET USERS API
    // Test case for getting a list of users
    it('should get a list of users', async() => {
        const res = await chai.request(server)
            .get('/api/auth/users')
            .set('x-auth-token', token);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
    });

});