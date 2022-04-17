require("dotenv").config();
const env = require('../utils/envParser');

module.exports = {
  db: {
    host: env.getString("DB_HOST", "localhost"),
    port: env.getNumber("DB_PORT", "3306"),
    user: env.getString("DB_USER", "root"),
    password: env.getString("DB_PASSWORD", ""),
    database: env.getString("DB_NAME", "delilah_resto"),
  },
  cache: {
    host: env.getString("CACHE_HOST", "localhost"),
    port: env.getNumber("CACHE_PORT", 6379),
    user: env.getString("CACHE_USER", ""),
    password: env.getString("CACHE_PASSWORD", ""),
  },
  server: {
    port: env.getNumber("NODE_PORT", 3000),
    enviroment: env.getString('NODE_ENV', 'development')
  },
  admin: {
    email: env.getString("ADMIN_EMAIL", "admin@test.com"),
    password: env.getString("ADMIN_PASSWORD", "admin"),
  },
  auth: {
    google: {
      clientID: env.getString("GOOGLE_CLIENT_ID", ""),
      clientSecret: env.getString("GOOGLE_CLIENT_SECRET", ""),
      callback_url: env.getString("GOOGLE_CALLBACK_URL", "localhost:3000/auth/google/callback"),
    },
  },
  session: {
    keys: [
      env.getString("SESSION_KEY_A", "ReadingThisIsNotAllowed"),
      env.getString("SESSION_KEY_B", "O:ThisTextToo!!"),
    ],
    cookie: {
      age: env.getNumber("SESSION_COOKIE_AGE", 24 * 60 * 60 * 1000),
      secure: env.getBoolean("SESSION_COOKIE_SECURE", false),
    }
  },
  services: {
    paypal: {
      client_id: env.getString('PAYPAL_CLIENT_ID', null),
      client_secret: env.getString('PAYPAL_CLIENT_SECRET', null),
      return_callback_url: env.getString('PAYPAL_CALLBACK_RETURN_URL'),
      cancel_callback_url: env.getString('PAYPAL_CALLBACK_CANCEL_URL')
    }
  }
};
