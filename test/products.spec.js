const request = require('supertest');
const expect = require('chai').expect;

const app = require('../main');
// const productsUtils = require('../src/utils/testUtils').products;
const usersUtils = require('../src/utils/testUtils').users;
const { placeholders } = usersUtils;

let testResponse;

describe("#products", function(){
  before(function (done) {
    usersUtils.initUsers()
      .then(() => done());
  });
  describe('Add a product "/products"', function() {
    it('Deberia devolver el status code "403" si el usuario no es administrador', function(done) {
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
    it('Deberia devolver el status code "422" si los campos son invalidos', function(done) {
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
    it('Deberia devolver el status code "201" si los campos son validos', function(done) {
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
    it('Deberia devolver el status code "401" si no se encuentra el token', function(done) {
      request(app)
      .get('/products')
      .end((err, res) => {
        testResponse = res;
        expect(res.statusCode).to.equal(401);
        done();
      });
    });
    it('Deberia devolver el status code "200"', function(done) {
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