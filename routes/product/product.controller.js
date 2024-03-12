const productModule = require("./product.module");

const createproductController = async (req, res) => {
  const result = await productModule.createproductModule(req);
  console.log(result);
  return res.send(result);
};

const getProductModuleList = async (req, res) => {
  const result = await productModule.getProductList(req)
  console.log(result);
  return res.send(result);
};

const getProductModule = async (req, res) => {
  const result = await productModule.getProductModule(req)
  console.log(result);
  return res.send(result);
};

module.exports = {
  createproductController: createproductController,
  getProductModule: getProductModule,
  getProductModuleList: getProductModuleList,
}