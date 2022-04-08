const { sha256 } = require("js-sha256");
const User = require("../model/User");
const Credential = require("../../auth/model/Credential");

async function where(where) {
  return await User.findOne({ where });
}

async function create(user, credential = null) {
  if (!credential) {
    let local_credential = {
      provider_userId: '',
      provider_name: 'local',
      password: sha256(user.password),
    };
    credential = local_credential;
  }
  delete user.password

  const newUser = await User.create({
    ...user,
    credentials: [credential]
  }, {
    include: [Credential]
  });
  return newUser;
}

module.exports = {
  get: {
    all: async () => {
      let users = await User.findAll({
        include: [{
          model: Credential,
          attributes: {
            exclude: ['password', 'access_token', 'refresh_token', 'userId']
          }
        }]
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
      await User.destroy({ where: { id } });
    },
    byEmail: async (email) => {
      await User.destroy({ where: { email } })
    }
  },
  where,
  create,
}