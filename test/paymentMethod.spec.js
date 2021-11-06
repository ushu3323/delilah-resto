const request = require("supertest");
const expect = require("chai").expect;

const app = require("../main");
const testUtils = require("../src/utils/testUtils");

let testResponse;

describe("#Payment Method", function () {
    const users = testUtils.users;
    before(function (done) {
        users.initUsers()
        .then(() => done());
    })
    
    describe('Create a new payment method "/paymentmethods"', function (done) {
        const payload = {
            name: "Tarjeta credito",
            enabled: true,
        };
        it('Should return code "401" if a token has not been provided', function (done) {
            request(app)
                .post("/paymentmethods")
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

        it('Should return code "200"', function (done) {
            request(app)
                .get("/paymentmethods")
                .set({ Authorization: `Bearer ${users.placeholders.admin.token}` })
                .end((err, res) => {
                    testResponse = { statusCode: res.statusCode, body: res.body };
                    expect(res.statusCode).to.be.eq(200);
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
    })
    after(function (done) {
        users.deleteUsers()
        .then(() => done())
        .catch((err) => done(err))
    })
});
