require("dotenv").config();
const env = require('../utils/envParser');

module.exports = {
  db: {
    host: env.getString("DB_HOST", "localhost"),
    port: env.getNumber("DB_PORT", "3306"),
    user:env.getString("DB_USER", "root"),
    password:env.getString("DB_PASSWORD", ""),
    database:env.getString("DB_NAME", "delilah_resto"),
  },
  cache: {
    host:env.getString("CACHE_HOST", "localhost"),
    port: env.getNumber("CACHE_PORT", 6379),
    user:env.getString("CACHE_USER", ""),
    password:env.getString("CACHE_PASSWORD", ""),
  },
  server: {
    port: env.getNumber("NODE_PORT", 3000),
  },
  admin: {
    email: env.getString("ADMIN_EMAIL", "admin@test.com"),
    password: env.getString("ADMIN_PASSWORD", "admin"),
  },
  auth: {
    jwt: {
      key: env.getBoolean("JWT_KEY", "YouShouldntReadThis:O"),
    },
  },
};
