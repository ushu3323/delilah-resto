const { expect } = require('chai');
const request = require('supertest');

const app = require('../main');
const testUtils = require('../src/utils/testUtils').users;
const { placeholders } = testUtils
let testResponse;

describe('#users', function () {
  before(function (done) {
    // Adds example users to the database
    testUtils.initUsers()
      .then(() => done())
      .catch((err) => done(err))
  });

  describe('Register User "/users"', function () {
    it('Deberia devolver el status code "422" si el registro es invalido (falta: nombre completo)', function (done) {
      const payload = {...placeholders.userRegister};
      delete payload.fullName;

      request(app)
        .post("/users")
        .send(payload)
        .end((err, res) => {
          testResponse = {statusCode: res.statusCode, body: res.body};
          expect(res.statusCode).to.be.equal(422);
          done();
        })
    });
    
    it('Deberia devolver el status code "201" si los datos enviados son validos', function (done){
      request(app)
        .post("/users")
        .send(placeholders.userRegister)
        .end((err,res) => {
          testResponse = {statusCode: res.statusCode, body: res.body};
          expect(res.statusCode).to.be.equal(201);
          done();
        })
    });
  });

  describe('Login "/users/login"', function () {
    const ROUTE = "/users/login";
    it('Deberia devolver el status code "422" cuando no se esten enviando las credenciales', function (done) {
      request(app)
        .post(ROUTE)
        .send({})
        .end(function (err, res) {
          testResponse = {statusCode: res.statusCode, body: res.body};
          expect(res.statusCode).equal(422, "");
          done();
        });
    });

    it('Deberia devolver el status code "422" cuando las credenciales sean inválidas', function (done) {
      const payload = {
        email: 'email@example.com',
        password: 'thisIsNotAPass'
      }
      request(app)
        .post(ROUTE)
        .send(payload)
        .end(function (err, res) {
          testResponse = {statusCode: res.statusCode, body: res.body};
          expect(res.statusCode).equal(422, "");
          done();
        })
    })

    it('Deberia devolver el status code "200" y un token cuando las credenciales sean validas', function (done) {
      const payload = placeholders.user;

      request(app)
        .post(ROUTE)
        .send(payload)
        .end(function (err, res) {
          testResponse = {statusCode: res.statusCode, body: res.body};
          const { token } = res.body;
          expect(res.statusCode).equal(200);
          expect(token).to.be.a("string");
          expect(token).to.have.lengthOf.above(0);
          done();
        });
    });
  });

  describe('Show All Users "/users"', function () {
    it('Deberia devolver el status code "403" si el usuario NO es administrador', function (done) {
      request(app)
      .get('/users')
      .set({"Authorization": `Bearer ${placeholders.user.token}`})
      .end(function (err, res) {
        expect(res.statusCode).to.be.equal(403);
        done();
      });
    });

    it('Deberia devolver status code "200" si el usuario es administrador', function (done) {
      // console.log("test users:", placeholders);
      request(app)
        .get('/users')
        .set({ "Authorization": `Bearer ${placeholders.admin.token}` })
        .end(function (err, res) {
          // console.log("response:", res.body)
          testResponse = {statusCode: res.statusCode, body: res.body};
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).length.above(0);
          done();
      });
    });
  });

  afterEach(function () {
    if (this.currentTest.state == "failed") {
      console.log("\t- status code:", testResponse?.statusCode);
      console.log("\t- res.body:", testResponse?.body);
    }
    testResponse = {statusCode: null, body: null};
  });

  after(function (done) {
    const users = [placeholders.user, placeholders.admin, placeholders.userRegister];
    testUtils.deleteUsers(users)
    .then(() => done());
  });
});
