const knex = require('../../db/knex');
const request = require('supertest');
const app = require('../../server');
const expect = require('chai').expect;
const faker = require('faker');

describe('First test', () => {
    // before(async () => {
    //     await knex.migrate.latest();
    //     await knex.seed.run();
    // });
    it('List all products', (done) => {
        request(app)
            .get('/products')
            .set('Accept', 'aplication/json')
            .expect('Content-Type', /json/)
            .expect(200).then(response => {
                expect(response.body).to.be.a('array');
                done();
            });
    });

    it('Login test', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email: 'user@test.com',
                password: '1234'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.deep.equal('Login successful.');
                expect(res.body.token).to.be.a('string');
                if (err) return done(err);
                done();
            });
    });

    it('Register test', (done) => {
        const user = faker.helpers.userCard()
        console.log(user);
        request(app)
            .post('/user/register')
            .send({
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ')[1],
                email: user.email,
                password: '1234',
                address: user.address.street + ' ' + user.address.suite + ' ' + user.address.city
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.be.a('object');
                console.log(res.body);
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.deep.equal('User successfully registered.');
                if (err) return done(err);
                done();
            });
    });
});