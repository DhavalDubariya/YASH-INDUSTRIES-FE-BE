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

module.exports = {
  createproductController: createproductController,
  getProductModule: getProductModule,
  getOrderListController: getOrderListController,
  updateProductController: updateProductController,
  orderDetailController:orderDetailController
}