//Write your tests here
test('sanity', () => {
  expect(false).toBe(false)
})

const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const { truncate } = require('../data/dbConfig');
const testUser = {username: 'liba', password: 'liba'}

describe('test server', () => {
    describe('Get request for jokes', () => {
        it('should return a status 400 when not logged in', async () => {
            const res = await request(server).get('/api/jokes')
        expect(res.status).toBe(400);
        });
        it('should return json', async() => {
            const res = await request(server).get('/api/jokes');
            expect(res.type).toBe('application/json')
        });
    });
describe("test registration", () => {
        it('should return a status code of 201 when adding a new user', async () => {
            await db('users').truncate()
            const res = await request(server)
            .post('/api/auth/register')
            .send(testUser);
            expect(res.status).toBe(201)
        });
        it('invilad user authentication', async () => {
            const res = await request(server)
            .post('/api/auth/register')
            .send({user: "rafi", pass: "abc123*"});
            expect(res.status).toBe(500);
        });
    });
describe("user login", ()=> {
        test('should return status of 200 with test user', async () => {
            const res = await request(server)
            .post('/api/auth/login')
            .send(testUser);
            expect(res.status).toBe(200)
        })
        test('should return 401 with invalid user', async () => {
            const res = await request(server)
            .post('/api/auth/login')
            .send({ username: 'mohammad', password: '123abc' })
            expect(res.status).toBe(401)
        })
    });
});
