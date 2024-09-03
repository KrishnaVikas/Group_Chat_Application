import * as chai from 'chai';
import chaiHttp from 'chai-http';
import * as server from '../server.js';
chai.use(chaiHttp);

const { expect } = chai;

describe('Group API', () => {

    let token = '';
    let groupId = '';
    //Before running the tests, login to get a valid token
    before((done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    //GROUP CREATE API
    // Test case for creating a group
    it('should create a new group', (done) => {
        chai.request(server)
            .post('/api/group/create')
            .set('x-auth-token', token)
            .send({ name: 'Group1' })
            .end((err, res) => {
                groupId = res.body.group._id;
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name').eql('Group1');
                done();
            });
    });

    // Test case for creating a group that already exists
    it('should not create a new group with existing group name', (done) => {
        chai.request(server)
            .post('/api/group/create')
            .set('x-auth-token', token)
            .send({ name: 'Group1' })
            .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Group already exists');
                done();
            });
    });

    //GET LIST OF GROUPS API
    // Test case for getting a list of groups
    it('should get a list of groups', (done) => {
        chai.request(server)
            .get('/api/group')
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    //GROUP DELETE API
    // Test case for deleting a group
    it('should delete a group successfully', (done) => {
        chai.request(server)
            .delete(`/api/group/${groupId}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Group deleted');
                done();
            });
    });

    //ADD MEMBERS API
    // Test case for adding a user to a group
    it('should add a user to a group successfully', (done) => {
        chai.request(server)
            .post(`/api/group/${groupId}/add-member`)
            .set('x-auth-token', token)
            .send({ userId: 'someUserId' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('User added to group');
                done();
            });
    });

    // Test case for adding an existing user to group
    it('should not add an existing user to group', (done) => {
        chai.request(server)
            .post(`/api/group/${groupId}/add-member`)
            .set('x-auth-token', token)
            .send({ userId: 'someExistingUserId' })
            .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('User already exists in the group');
                done();
            });
    });

    //REMOVE MEMBERS API
    // Test case for removing a user from a group
    it('should remove a user from a group successfully', (done) => {
        chai.request(server)
            .delete(`/api/group/${groupId}/remove-member/someUserId`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('User removed from group');
                done();
            });
    });

    // Test case for not removing a user from a non-existing group
    it('should not remove a user from a non-existing group', (done) => {
        chai.request(server)
            .delete(`/api/group/nonExistingGroupId/remove-member/someUserId`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Group not found');
                done();
            });
    });

    // Test case for not removing a non exisitng user in a group
    it('should not remove a non existing user in a group', (done) => {
        chai.request(server)
            .delete(`/api/group/${groupId}/remove-member/someNonExistingUserId`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('User not in group');
                done();
            });
    });

    //SEARCH BY GROUP NAME API
    // Test case for searching groups by name
    it('should search for groups by name', (done) => {
        chai.request(server)
            .get('/api/group/search/nameToBeSearched')
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
