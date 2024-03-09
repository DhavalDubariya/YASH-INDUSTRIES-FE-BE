const productModule = require("./product.module");

const createproductController = async (req, res) => {
  const result = await productModule.createproductModule(req);
  console.log(result);
  return res.send(result);
};



module.exports = {
  createproductController:createproductController,
}