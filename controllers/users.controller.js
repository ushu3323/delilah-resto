const { Users } = require("../models/Data");

function registerUser(req,res) {
    Users.register(req.body);
    res.sendStatus(200);
};
  
function login(req, res){
    const { username, password } = req.body;
    const user = Users.list.find(u => u.username === username);
    res.status(200).json({userID: user.id});
}

function allUsers(req, res){
    res.status(200).json(Users.list)
}

module.exports = {
    registerUser,
    allUsers,
    login,
}