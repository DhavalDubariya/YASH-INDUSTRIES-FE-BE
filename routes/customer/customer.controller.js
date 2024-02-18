const customerModule = require("./customer.module");

const createCustomerController = async (req, res) => {
  const result = await customerModule.createCustomerModule(req);
  return res.send(result);
};

const getCustomerController = async(req,res) => {
  const result = await customerModule.getCustomerModule(req);
  return res.send(result);
}

const getCustomerDetailController = async(req,res) => {
  const result = await customerModule.getCustomerDetailModule(req)
  return res.send(result)
}

const updateCustomerController = async(req,res) => {
  const result = await customerModule.updateCustomerModule(req)
  return res.send(result)
}

module.exports = {
  createCustomerController:createCustomerController,
  getCustomerController:getCustomerController,
  getCustomerDetailController:getCustomerDetailController,
  updateCustomerController:updateCustomerController
}