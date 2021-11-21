const User = require("../user/model/User");
const Product = require("../product/model/Product");
const Order = require("../order/model/Order");
const OrderProducts = require("../order/model/OrderProducts");
const paymentMethod = require("../paymentMethod/model/PaymentMethod");

const config = require("../config");
const sequelize = require("../connection/sequelize");
const { sha256 } = require("js-sha256");

const sync_models = async () => {
  try {
    await sequelize.authenticate();
    console.log("Authenticated successfully");
    await sequelize.sync({ force: true, alter: false });
    console.log(`Syncronized "${sequelize.config.database}" database!`);
  } catch (error) {
    console.error(error.cause);
  }

  // Register admin user
  await User.findOrCreate({
    where: { id: 1, isAdmin: true },
    order: [["id", "ASC"]],
    defaults: {
      username: config.admin.username,
      password: config.admin.password,
      fullName: "superuser",
      email: "testuser@example",
      isAdmin: true,
    },
  });
  process.exit();

  /* const [testUser, user_created] = await User.findOrCreate({
    where: { email: 'testuser@example.com' },
    defaults:{
      username: 'user',
      fullName: 'test user',
      password: 'userpass',
      email: 'testuser@example.com',
      isAdmin: false,
      phoneNumber: '+380991234567',
      address: 'Street 1, Building 1, Room 1',
    }
  });
  const [testProduct, prod_created] = await Product.findOrCreate({
    where: { name: 'Product 1' },
    limit: 1,
    defaults: {
      name: 'Product 1',
      price: 100,
      category: 'category 1',
      enabled: true,
    }
  });

  // Get the first order of 'testUser'
  let testOrder = (await testUser.getOrders({
    where: { status: 'new' },
    limit: 1,
    include: {
      model: Product,
    }
  }))[0];

  if (!testOrder) {
    testOrder = await Order.create({
      status: 'new',
      userId: testUser.id,
    });
    console.log('Order created!');
  }

  let finalUser = await User.findOne({
    where: { email: 'testuser@example' },
  });
  console.log('user', finalUser);
  */
};

param = process.argv[2];
if (param == "-s") {
  sync_models();
} else {
  console.log(`Unknown parameter: ${param}`);
}
