const expect = require('chai').expect;
const request = require('supertest');

const app = require('../main');
const testUtils = require('../src/utils/testUtils');
const { placeholders } = testUtils.users

let testResponse;
let payload;

async function deletePlaceholders(done) {
  const { users, products } = testUtils
  await testUtils.bulkDelete([users, products])
  done()
}

describe("#orders", function (){
  before(function (done) {
    const { users, products } = testUtils;
    testUtils.bulkInit([users, products])
    .then(() => { 
      payload = {
        products: [
          {
            id: products.placeholders[0].id,
            amount: 2,
          }
        ],
        paymentMethodId: 1
      };
      done()
    })
  });

  describe('Add an Order "/orders"', function() {
    it('Should return code "401" if a token has not been provided ', function(done) {
      request(app)
        .post('/orders')
        //.set({ "Authorization": `Bearer ${placeholders.admin.token}` })
        .send(payload)
        .end((err, res) => {
          testResponse = res;
          expect(res.statusCode).to.equal(401);
          done();
        })
    });

    it('Should return code "422" if a product is invalid', function(done) {
      (async () => {
        request(app)
        .post('/orders')
        .set({ "Authorization": `Bearer ${placeholders.admin.token}` })
        .send({
          products: [
            {
              id: (await testUtils.products.getLastProductId()) + 1,
              amount: 2,
            }
          ],
          paymentMethodId: 1
        })
        .end((err, res) => {
          testResponse = res;
          expect(res.statusCode).to.equal(422);
          done();
        });
      })();
    });

    it('Should return code "201" if the order was created', function (done) {
      request(app)
        .post('/orders')
        .set({"Authorization": `Bearer ${placeholders.user.token}`})
        .send(payload)
        .end((err, res) => {
          testResponse = {statusCode: res.statusCode, body: res.body}
          expect(res.status).to.equal(201)
          done()
        })
    });

    afterEach(function (){
      if (this.currentTest.state === 'failed') {
        console.log('\tres.statusCode:', testResponse?.statusCode);
        console.log('\tres.body:', testResponse?.body);
      }
    });
  });

  after(function(done) {
    deletePlaceholders(done)
      .catch((reason) => done(reason));
  });
});