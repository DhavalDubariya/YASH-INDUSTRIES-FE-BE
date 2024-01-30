const router = require("express").Router();
const userDb = require('./user.db')


const loginModule = async(req) => {
    var email = req.body.email
    var password = req.body.password
    return {status:true,data:[]}
}

module.exports = {
    loginModule:loginModule
}