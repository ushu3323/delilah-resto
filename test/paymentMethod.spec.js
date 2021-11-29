const request = require("supertest");
const expect = require("chai").expect;

const app = require("../main");
const testUtils = require("../src/utils/testUtils");

let testResponse;

describe("#Payment Method", function () {
  const { users, paymentMethods } = testUtils;

  before(function (done) {
    testUtils
      .bulkInit([users, paymentMethods])
      .then(() => done())
      // .then(() => console.table(paymentMethods.placeholders))
      .catch((err) => done(err));
  });

  describe('Create a new payment method "/paymentmethods"', function (done) {
    const payload = paymentMethods.placeholders.testMethod;
    it('Should return code "401" if a token has not been provided', function (done) {
      request(app)
        .post("/paymentmethods")
        .send(payload)
        // .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.eq(401);
          done();
        });
    });

    it('Should return code "201" if it was created', function (done) {

      request(app)
        .post("/paymentmethods")
        .send(payload)
        .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.eq(201);
          payload.id = res.body.paymentMethod.id;
          done();
        });
    });

    it("Should return a list with the recently created payment method on it", function (done) {
      request(app)
        .get(`/paymentmethods`)
        .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.body).to.be.an("array");
          expect(res.body).to.deep.include({
            name: payload.name,
            id: payload.id,
            enabled: false
          });
          done();
        });
    });
  });

  describe('Get all payment methods "/paymentmethods"', function () {
    it('Should return code "401" if a token has not been provided', function (done) {
      request(app)
        .get("/paymentmethods")
        // .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.eq(401);
          done();
        });
    });

    it('Should return code "200" and all the payment methods if the user is an admin', function (done) {
      request(app)
        .get("/paymentmethods")
        .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.eq(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.satisfy(function (arr) {
            const items = arr.map((item) => Object.keys(item));
            for (let itemKeys of items) {
              if (!itemKeys.some((k) => ["id", "name", "enabled"].includes(k)))
                return false;
            }
            return true;
          }, "Array items should have only keys: 'id', 'name', 'enabled'");
          
          done();
        });
    });
    it('Should return code "200" and only the enabled payment methods if the user is not an admin', function (done) {
      request(app)
        .get("/paymentmethods")
        .set({ Authorization: `Bearer ${users.placeholders.user.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.eq(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.satisfy(function (arr) {
            const items = arr.map(item => Object.keys(item))
            for (let itemKeys of items) {
              if(!itemKeys.some(k=>["id", "name"].includes(k))) return false;
            }
            return true;
          }, "Array items should have only keys: 'id', 'name'");
          done();
        });
    });


  });

  describe('Edit a payment method "/paymentmethods/:id"', function () {
    it('Should return code "401" if a token has not been provided', function (done) {
      request(app)
        .patch("/paymentmethods/1")
        // .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.eq(401);
          done();
        });
    });

    it('Should return code "404" if the payment method doesn\'t exist', function (done) {
      request(app)
        .patch("/paymentmethods/20") // TODO: use the next number of the last paymend method id existing
        .send({ enabled: true })
        .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.eq(404);
          expect(res.body).to.have.keys("error", "msg");
          done(err);
        });
    });

    it('Should return code "200" if the payment method was succesfully edited', function (done) {
      request(app)
        .patch(`/paymentmethods/${paymentMethods.placeholders.cash.id}`)
        .send({ enabled: true })
        .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body};
          expect(res.statusCode).to.be.eq(200);
          expect(res.body.new).to.deep.equal({
            name: paymentMethods.placeholders.cash.name,
            enabled: true,
          });
          done();
        });
    });
  });

  describe('Delete a payment method "/paymentmethods/:id"', function () {
    it('Should return code "404" if the payment method doesnt exists', function (done) {
      request(app)
        .delete("/paymentmethods/20") // TODO: use the next number of the last paymend method id existing
        .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.body).to.include.keys("msg", "error");
          expect(res.statusCode).to.be.eq(404);
          done();
        });
    });

    it('Should return status code "200" if the payment method is deleted', function (done) {
      request(app)
        .delete(`/paymentmethods/${paymentMethods.placeholders.cash.id}`)
        .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
        .end((err, res) => {
          testResponse = { statusCode: res.statusCode, body: res.body };
          expect(res.statusCode).to.be.eq(200);
          done();
        });
    });
  });

  afterEach(function () {
    if (this.currentTest.isFailed()) {
      /* console.log("\t- status code:", testResponse?.statusCode);
      console.log("\t- res.body:", testResponse?.body); */
      console.log(testResponse);
    }
    testResponse = { statusCode: null, body: null };
  });

  after(function (done) {
    const { users, paymentMethods } = testUtils;
    testUtils
      .bulkDelete([users, paymentMethods])
      .then(() => done())
      .catch((err) => done(err));
  });
});
