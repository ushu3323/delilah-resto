const hosts = process.env.EC2_ADDRESSES.split(",").filter((address) => address.length)
console.log(hosts)
module.exports = {
  apps: [
    {
      name: "app",
      script: "npm start",
      env_production: {
        NODE_ENV: "production",
        MORGAN_FORMAT: "dev"
      },
      env_development: {
        NODE_ENV: "development",
        MORGAN_FORMAT: "dev"
      }
    }
  ],
  deploy : {
    production : {
      user : 'ec2-user',
      host: hosts,
      ref  : 'origin/master',
      repo: 'https://github.com/ushu3323/delilah-resto',
      path : '/home/ec2-user/delilah-resto',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env production',
      env: {
        NODE_PORT: process.env.NODE_PORT,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        KEY: process.env.KEY,
      }
    }
  }
};
