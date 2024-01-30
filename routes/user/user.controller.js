const userModule = require("./user.module");

const loginController = async (req, res) => {
  const result = await userModule.loginModule(req);
  return res.send(result);
};

module.exports = {
    loginController:loginController
}