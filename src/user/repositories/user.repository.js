const User = require("../model/User");
const { sha256 } = require("js-sha256");

async function where(where) {
  return await User.findOne({where});
}

async function create(user) {
  const newUser = await User.create({...user, password: sha256(user.password)});
  return newUser;
}

module.exports = {
  get: {
    all: async () => {
      let users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      users = users.map(u => u.toJSON());
      return users;
    },
    byId: async (id) => {
      const user = await User.findByPk(id);
      return user;
    },
    byEmail: async (email) => {
      const user = await User.findOne({ where: { email } });
      return user;
    },
    byUsername: async (username) => {
      const user = await User.findOne({ where: { username } });
      return user;
    }
  },
  del: {
    byId: async (id) => {
      await User.destroy({where:{id}});
    },
    byEmail: async (email) => {
      await User.destroy({where: {email}})
    }
  },
  where,
  create,
}