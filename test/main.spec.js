const { expect } = require("chai");
const request = require("supertest");
let app = require("../main");

describe('#main', function () {
  describe('Home "/"', function () {
    it('Status code "200"', function (done) {
      request(app)
        .get('/')
        .end(function(err, res) {
          expect(res.statusCode).equal(200, "OK")
          done();
        });
    });
  });

  /* describe('Swagger Docs "/docs"', function () {
    it('Status Code "200"', function (done) {
      request(app)
        .get('/docs')
        .end(function (err, res) {
          expect(res.statusCode).equal(200, "OK");
          done();
        });
    });
  }); */
});