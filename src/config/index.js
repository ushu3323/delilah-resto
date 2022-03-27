require("dotenv").config();

module.exports = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "delilah_resto",
  },
  cache: {
    host: process.env.CACHE_HOST || "localhost",
    port: process.env.CACHE_PORT || "6379",
    user: process.env.CACHE_USER || "",
    password: process.env.CACHE_PASSWORD || "",
  },
  server: {
    port: process.env.NODE_PORT || 3000,
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@test.com",
    password: process.env.ADMIN_PASSWORD || "admin",
  },
  auth: {
    jwt: {
      key: process.env.JWT_KEY || "YouShouldntReadThis:O",
    },
  },
};
