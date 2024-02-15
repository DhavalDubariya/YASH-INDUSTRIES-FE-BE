const userModule = require("./user.module");

const loginController = async (req, res) => {
  try{
    const result = await userModule.loginModule(req);
    return res.send(result);
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