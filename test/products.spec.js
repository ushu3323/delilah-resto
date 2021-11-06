const request = require('supertest');
const expect = require('chai').expect;

// const productsUtils = require('../src/utils/testUtils').products;
const app = require('../main');
const usersUtils = require('../src/utils/testUtils').users;
const { placeholders } = usersUtils;

let testResponse;

describe("#products", function(){
  before(function (done) {
    usersUtils.initUsers()
      .then(() => done());
  });
  describe('Add a product "/products"', function() {
    it('Should return code "403" if the user is not an admin', function(done) {
      const product = {
        name: 'producto',
        price: 100,
      };
      request(app)
        .post('/products')
        .send(product)
        .set('Authorization', `Bearer ${placeholders.user.token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(403);
          done();
        });
    })
    it('Should return code "422" if the fields are invalid', function(done) {
      const payload = {
        title: 'producto',
        price: '100',
      }
      request(app)
        .post('/products')
        .set('Authorization', `Bearer ${placeholders.admin.token}`)
        .send(payload)
        .end((err, res) => {
          testResponse = res;
          expect(res.statusCode).to.equal(422);
          done();
        });
    });
    it('Should return code "201" if fields are invalid', function(done) {
      const payload = {
        name: 'Producto',
        price: 100,
      }
      request(app)
        .post('/products')
        .set('Authorization', `Bearer ${placeholders.admin.token}`)
        .send(payload)
        .end((err, res) => {
          testResponse = res;
          expect(res.statusCode).to.equal(201);
          done();
        });
    });
  });

  describe('Get all products "/products"', function() {
    it('Should return code "401" if a token has not been provided', function(done) {
      request(app)
      .get('/products')
      .end((err, res) => {
        testResponse = res;
        expect(res.statusCode).to.equal(401);
        done();
      });
    });
    it('Should return code "200" if the request was ok', function(done) {
      request(app)
        .get('/products')
        .set('Authorization', `Bearer ${placeholders.admin.token}`)
        .end((err, res) => {
          testResponse = res;
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  afterEach(function () {
    if (this.currentTest.state == "failed") {
      console.log("\t- status code:", testResponse.statusCode);
      console.log("\t- res.body:", testResponse.body);
    }
    testResponse = { statusCode: null, body: null };
  });

  after(function (done) {
    usersUtils.deleteUsers()
      .then(() => done());
  })
})