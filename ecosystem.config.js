module.exports = {
  apps: [{
    name: "api",
    script: 'main.js',
    watch: false,
    restart_delay: 5000,
    autorestart: true
  }]
};