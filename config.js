require('dotenv').config()

module.exports = {
  node: {
    port: process.env.NODE_PORT || 3000
  }
}