const router = require("express").Router();
const db = require('../../model/index')


const loginModule = async(req) => {
    var email = req.body.email
    var password = req.body.password
    
    var chackLogin = await db.User.findOne({ email,password})
    console.log(chackLogin)
    if(chackLogin == null){
        return {
            status:false,
            error:"Invalid Email or Password"
        }
    }
    chackLogin = chackLogin.toObject()
    var token = new Date().getTime()
    var currentDate = new Date();
    // await db.UserAccessToken.deleteMany({})
    await db.UserAccessToken.create({
        user_id:chackLogin._id,
        token:token,
        timestamp:new Date(),
        expireTime:currentDate.setDate(currentDate.getDate() + 1),
        flag_log_out:false
    })
    console.log(chackLogin)
    delete chackLogin["password"]
    // console.log('chackLogin[0]["password"]', chackLogin["password"])
    chackLogin["accee_token"] = token
    return {
        status:true,
        data:chackLogin
    }
}

const getUserDetailModule = async(req) => {
    var userId = req.user_id
    var userDetail = (await db.User.findOne({_id:userId})).toObject()
    delete userDetail["password"]
    return { status:true,data:userDetail}
}

module.exports = {
    loginModule:loginModule,
    getUserDetailModule:getUserDetailModule
}