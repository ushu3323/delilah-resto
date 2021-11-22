const { expect } = require("chai");
const request = require("supertest");

const app = require("../main");
const testUtils = require("../src/utils/testUtils");
const { placeholders } = testUtils.users;
let testResponse;

describe("#users", function () {
  before(function (done) {
    // Adds example users to the database
    testUtils.users
      .initPlaceholders()
      .then(() => done())
      .catch((err) => done(err));
  });

  describe('Register User "/users"', function () {
    it('Should return code "422" if register is invalid (required: fullname)', function (done) {
      const payload = { ...placeholders.userRegister };
      delete payload.fullName;

      request(app)
        .post("/users")
        .send(payload)
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.equal(422);
          done();
        });
    });

    it('Should return code "201" if register is valid', function (done) {
      request(app)
        .post("/users")
        .send(placeholders.userRegister)
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.equal(201);
          done();
                })
    });
  });

  describe('Login "/users/login"', function () {
    const LOGIN_ROUTE = "/users/login";
    it('Should return code "422" if no credentials', function (done) {
      request(app)
        .post(LOGIN_ROUTE)
        .send({})
        .end(function (err, res) {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).equal(422, "");
          done();
        });
    });

    it('Should return code "422" on invalid credentials', function (done) {
      const payload = {
        email: "email@example.com",
        password: "thisIsNotAPass",
      };
      request(app)
        .post(LOGIN_ROUTE)
        .send(payload)
        .end(function (err, res) {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).equal(422, "");
          done();
        });
    });

    it('Should return code "200" and a token, on valid credentials', function (done) {
      const payload = placeholders.user;

      request(app)
        .post(LOGIN_ROUTE)
        .send(payload)
        .end(function (err, res) {
          testResponse = { statusCode: res.statusCode, body: res.body };
          const { token } = res.body;
          expect(res.statusCode).equal(200);
          expect(token).to.be.a("string");
          expect(token).to.have.lengthOf.above(0);
          done();
        });
    });
  });

  describe('Show All Users "/users"', function () {
    it('Should return code "403" if the user is NOT admin', function (done) {
      request(app)
        .get("/users")
        .set({ Authorization: `Bearer ${placeholders.user.token}` })
        .end(function (err, res) {
          expect(res.statusCode).to.be.equal(403);
          done();
        });
    });

    it('Should return code "200" if the user is admin', function (done) {
      // console.log("test users:", placeholders);
      request(app)
        .get("/users")
        .set({ Authorization: `Bearer ${placeholders.admin.token}` })
        .end(function (err, res) {
          // console.log("response:", res.body)
          testResponse = { statusCode: res.statusCode, body: res.body };
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
    testResponse = { statusCode: null, body: null };
  });

  after(function (done) {
    const users = [
      placeholders.user,
      placeholders.admin,
      placeholders.userRegister,
    ];
    testUtils.users.deletePlaceholders(users).then(() => done());
  });
});
