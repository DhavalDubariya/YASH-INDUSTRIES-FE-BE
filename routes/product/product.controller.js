const productModule = require("./product.module");

const createproductController = async (req, res) => {
  const result = await productModule.createproductModule(req);
  return res.send(result);
};



module.exports = {
    createproductController:createproductController
}