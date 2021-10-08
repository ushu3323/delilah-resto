const jwt = require('jsonwebtoken');
const { Users } = require("../../models/Data");


function registerUser(req,res) {
    Users.register(req.body);
    res.sendStatus(200);
};
  
function login(req, res){
    const user = req.user;
    const token = jwt.sign({id:user.id, name:user.name, email:user.email}, "un_token");
    res.status(200).json({token:token});
}

function allUsers(req, res){
    res.status(200).json(Users.list)
}

module.exports = {
    registerUser,
    allUsers,
    login,
}