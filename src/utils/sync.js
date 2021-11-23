const User = require("../user/model/User");
const Product = require("../product/model/Product");
const Order = require("../order/model/Order");
const OrderProducts = require("../order/model/OrderProducts");
const paymentMethod = require("../paymentMethod/model/PaymentMethod");

const config = require("../config");
const sequelize = require("../connection/sequelize");
const { sha256 } = require("js-sha256");

const actions = {
  sync: false,
  forceSync: false,
  registerAdmin: false,
  forceRegister: false,
};

const sync_models = async () => {
  try {
    await sequelize.authenticate();
    console.log("Authenticated successfully to the database");
    if (actions.sync) {
      try {
        await sequelize.sync({ force: actions.forceSync, alter: false });
        console.log(`Syncronized "${sequelize.config.database}" database!`);
      } catch(err) {
        console.log(err.cause);
        console.log(`Error: while syncronizing "${sequelize.config.database}" database,\nprobably there is already data in the database... try -fs option to force syncronization (WARNING: this option deletes all data in db)`);
      }
    }

    if (actions.registerAdmin) {
      let [admin, isAdminCreated] = await User.findOrCreate({
        where: { username: "admin", isAdmin: true },
        defaults: {
          username: "admin",
          password: sha256(config.admin.password),
          fullName: "superuser",
          email: config.admin.email,
          isAdmin: true,
        },
      });

      if (isAdminCreated){
        console.log(`Admin user created: ${admin.email}`);
      } else {
        if (actions.forceRegister) {
          console.log(`Force created admin user`);
          console.log(`Admin user created: ${admin.email}`);
        } else {
          console.log(`Admin user already exists: ${admin.email}, run fsync or add -fr option to force creation`);
        }
      }
    }
  } catch (error) {
    console.error(error.cause);
  }

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

params = process.argv.slice(2);

for (param of params) {  
  if (param == "-s") {
    actions.sync = true;
  } else if (param == "-fs") {
    actions.sync = true;
    actions.forceSync = true;
  } else if (param == "-r") {
    actions.registerAdmin = true;
  } else if (param == "-fr") {
    actions.registerAdmin = true;
    actions.forceRegister = true;
  } else {
    console.log(`Unknown parameter: ${param}`);
    process.exit();
  }
}

const anyOption = actions.sync || actions.registerAdmin || actions.forceSync || actions.forceRegister;
if (!anyOption) {
  console.log("No valid options provided");
  console.log(`
  Usage: npm sync -- [options]
  Options:
    -s    Syncronize database
    -fs   Force syncronize database
    -r    Register admin user
    -fr   Force register admin user
  `);
  process.exit();
} else {
  console.log(actions);
  if (actions.forceSync) {
    console.log("WARNING: deleting dabatase data in 3 seconds!");
    setTimeout(() => sync_models(), 3000);
  } else {
    sync_models();
  }
}

