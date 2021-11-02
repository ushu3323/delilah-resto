const expect = require('chai').expect;
const request = require('supertest');

const app = require('../main');
const testUtils = require('../src/utils/testUtils');
const { placeholders } = testUtils.users

let testResponse;
let payload;

async function initPlaceholders(done){
  await testUtils.users.initUsers()
  await testUtils.products.initProducts()
  // await testUtils.orders.initOrders() 
  payload = {
      products: [
        {
          id: testUtils.products.placeholders[0].id,
          amount: 2,
        }
      ],
      paymentMethodId: 1
  };
  done()
}

async function deletePlaceholders(done) {
  await testUtils.users.deleteUsers()
  await testUtils.products.deleteProducts()
  done()
}

describe("#orders", function (){
  
  before(function (done) {
    initPlaceholders(done)
      .catch((reason) => done(reason));
  });

  describe('Add an Order "/orders"', function() {
    it('Deberia devolver el status code "401" si no se ingresa el token', function(done) {
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

    it('Deberia devolver el status code "422" si un producto no existe', function(done) {
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

    it('Deberia devolver el status code "201"', function (done) {
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