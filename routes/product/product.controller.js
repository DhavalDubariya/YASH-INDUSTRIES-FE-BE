const productModule = require("./product.module");

const createproductController = async (req, res) => {
  const result = await productModule.createproductModule(req);
  // console.log(result);
  return res.send(result);
};

const getOrderListController = async (req, res) => {
  const result = await productModule.getOrderListModule(req)
  // console.log(result);
  return res.send(result);
};

const getProductModule = async (req, res) => {
  const result = await productModule.getProductModule(req)
  // console.log(result);
  return res.send(result);
};

const updateProductController = async (req, res) => {
  const result = await productModule.updateProductModule(req)
  // console.log(result);
  return res.send(result);
}

const orderDetailController = async (req, res) => {
  const result = await productModule.orderDetailModule(req)
  return res.send(result);
}

const getCustomerOrderController = async(req,res) => {
  const result = await productModule.getCustomerOrderModule(req)
  return res.send(result);
}

const createDailyProductController = async(req,res) => {
  const result = await productModule.createDailyProductModule(req)
  return res.send(result);
}

const getDailyProductController = async(req,res) => {
  const result = await productModule.getDailyProductModule(req)
  return res.send(result);
}

const genricMachineController = async(req,res) => {
  const result = await productModule.genricMachineModule(req)
  return res.send(result);
}

const getWorkerController = async(req,res) => {
  const result = await productModule.getWorkerModule(req)
  return res.send(result);
}

module.exports = {
  createproductController: createproductController,
  getProductModule: getProductModule,
  getOrderListController: getOrderListController,
  updateProductController: updateProductController,
  orderDetailController:orderDetailController,
  getCustomerOrderController:getCustomerOrderController,
  createDailyProductController:createDailyProductController,
  getDailyProductController:getDailyProductController,
  genricMachineController:genricMachineController,
  getWorkerController:getWorkerController
}