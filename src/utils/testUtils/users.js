const jwt = require("jsonwebtoken");

const config = require("../../config");
const userRepository = require("../../user/repositories/user.repository");
// let subset = (obj, keys) => keys.reduce((a, b) => (a[b] = obj[b], a), {});

const placeholders = {
  admin: {
    username: "admin",
    fullName: "adminName adminSurname",
    email: "testadmin@example.com",
    phoneNumber: "123-456",
    address: "Street Address",
    password: "adminsecretPass",
    isAdmin: true,
    enabled: true,
  },
  user: {
    username: "test",
    fullName: "testName testSurname",
    email: "test@example.com",
    phoneNumber: "123-456",
    address: "Street Address",
    password: "secretpass",
    isAdmin: false,
    enabled: true,
  },
  userRegister: {
    username: "faketest",
    fullName: "faketestName testSurname",
    email: "faketest@example.com",
    phoneNumber: "123-456",
    address: "fakeStreet Address",
    password: "fakesecretpass",
    isAdmin: false,
    enabled: true,
  },
};

const initPlaceholders = async () => {
  const users = [placeholders.admin, placeholders.user];
  for await (let user of users) {
    await userRepository.create(user);
    user.token = getToken(user);
  }
};

const deletePlaceholders = async () => {
  const users = [
    placeholders.admin,
    placeholders.user,
    placeholders.userRegister,
  ];
  for await (const user of users) {
    await userRepository.del.byEmail(user.email);
  }
};

const getToken = (user) => {
  const { email, password } = user;
  const token = jwt.sign({ email, password }, config.server.key);
  return token;
};

/* (async () => {
  const admin = User.findOrCreate({
    username: "admin",
    fullName: "super user",
    email: "admin@example.com",
    phoneNumber: "123-456",
    address: "Street Address",
    password: "secretpass",
    isAdmin: true,
    enabled: true,
  });
  console.log((await getToken(admin)));
})(); */

module.exports = {
  deletePlaceholders,
  getToken,
  placeholders,
  initPlaceholders,
};
