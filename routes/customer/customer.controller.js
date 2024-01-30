const customerModule = require("./customer.module");

const createCustomerController = async (req, res) => {
  const result = await customerModule.createCustomerModule(req);
  return res.send(result);
};

module.exports = {
  createCustomerController:createCustomerController
}