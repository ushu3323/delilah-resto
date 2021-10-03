const User = require("./User");

module.exports = class Admin extends User {
    constructor(id, username, fullname, email, phoneNumber, address, password){
        super(id, username, fullname, email, phoneNumber, address, password);
        this.isAdmin = true;
    }
}