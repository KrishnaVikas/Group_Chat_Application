import * as chai from 'chai';
import chaiHttp from 'chai-http';
import axios from 'axios';
import * as server from '../server.js';

// Use chai-http plugin with chai
chai.use(chaiHttp);
const { expect } = chai;

describe('Basic Test', () => {
    it('should return a 200 status', async() => {
        // Make a request to the app and check the response
        await axios.get(server);
    });
});
