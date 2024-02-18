const userModule = require("./user.module");

const loginController = async (req, res) => {
  try{
    const result = await userModule.loginModule(req);
    if (result.status == true) {
      res.setHeader(
        "Set-Cookie",
        `yi-ssid=${result.data.accee_token}; Domain=localhost;Secure;Path=/;HttpOnly;SameSite=None;`
      );
      return res.send(result);
    } else {
      return res.send(result);
    }
  }catch(e){
    console.log(e)
    return res.send({
      status:false,
      error:"Somthing Want Wrong"
    })
  }
};

const getUserDetailController = async(req,res) => {
  try{
    const result = await userModule.getUserDetailModule(req);
    return res.send(result)
  }catch(e){
    console.log(e)
    return res.send({
      status:false,
      error:"Somthing Want Wrong"
    })
  }
}

module.exports = {
    loginController:loginController,
    getUserDetailController:getUserDetailController
}