const User = require("../user/model/User");
const Credential = require("../auth/model/Credential");
const Product = require("../product/model/Product");
const Order = require("../order/model/Order");
const OrderProducts = require("../order/model/OrderProducts");
const paymentMethod = require("../paymentMethod/model/PaymentMethod");

const config = require("../config");
const sequelize = require("../database/sequelize");
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
      } catch (err) {
        console.log(err.cause);
        console.log(
          `Error: while syncronizing "${sequelize.config.database}" database,\nprobably there is already data in the database... try -fs option to force syncronization (WARNING: this option deletes all data in db)`
        );
      }
    }

    if (actions.registerAdmin) {
      let local_credential = {
        provider_userId: "",
        provider_name: "local",
        password: sha256(config.admin.password),
      }
      let [admin, isAdminCreated] = await User.findOrCreate({
        where: { username: "admin", isAdmin: true },
        defaults: {
          username: "admin",
          fullName: "superuser",
          email: config.admin.email,
          isAdmin: true,
          enabled: true,
          credentials: [local_credential]
        },
        include: [ Credential ]
      });

      if (isAdminCreated) {
        console.log(`Admin user created: ${admin.email}`);
      } else {
        if (actions.forceRegister) {
          console.log(`Force created admin user`);
          console.log(`Admin user created: ${admin.email}`);
        } else {
          console.log(
            `Admin user already exists: ${admin.email}, add -fr option to force creation`
          );
        }
      }
    }
  } catch (error) {
    console.error(error.cause);
  }

  process.exit(); 
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

