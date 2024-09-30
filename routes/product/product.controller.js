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

const machineReportController = async(req,res) => {
  const result = await productModule.machineReportModule(req)
  return res.send(result);
}

const getTimeController = async (req, res) => { 
  const result = await productModule.getTimeModule(req)
  return res.send(result)
}

const createMachineReportController = async (req, res) => { 
  const result = await productModule.createMachineReportModule(req)
  return res.send(result)
}

const getMachineDataController = async(req,res) => {
  const result = await productModule.getMachineDataModule(req)
  return res.send(result)
}

const dispatchOrderController = async(req,res) => {
  const result = await productModule.dispatchOrderModule(req)
  return res.send(result)
}

const getdispatchOrderController = async(req,res) => {
  const result = await productModule.getdispatchOrderModule(req)
  return res.send(result)
}

const getDailyMachineReportController = async(req,res) => {
  const result = await productModule.getDailyMachineReportModule(req)
  return res.send(result)
}

const rejectionCountController = async(req,res) => {
  const result = await productModule.rejectionCountModule(req)
  return res.send(result)
}

const stockTackController = async(req,res) => {
  const result = await productModule.stockTackModule(req)
  return res.send(result)
}

const deleteDispatchOrderController = async(req,res) => {
  const result = await productModule.deleteDispatchOrderModule(req)
  return res.send(result)
}

const unitController = async(req,res) => {
  const result = await productModule.unitModule(req)
  return res.send(result)
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
  getWorkerController:getWorkerController,
  machineReportController: machineReportController,
  getTimeController:getTimeController,
  createMachineReportController:createMachineReportController,
  getMachineDataController:getMachineDataController,
  dispatchOrderController:dispatchOrderController,
  getdispatchOrderController:getdispatchOrderController,
  getDailyMachineReportController:getDailyMachineReportController,
  rejectionCountController:rejectionCountController,
  stockTackController:stockTackController,
  deleteDispatchOrderController:deleteDispatchOrderController,
  unitController:unitController
}