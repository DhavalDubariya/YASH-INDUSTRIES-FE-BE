const User = require('./user')
const UserAccessToken = require('./userAccessToken')
const Customer = require('./customer')
const ChangeLog = require('./changelog')
const Material = require('./material')
const Product = require('./product')
const Order  = require('./CustomerOrder')
const DailyProduct = require('./dayilyproduct')
const Machine = require('./machine')
const Worker = require('./worker')
const MachineReport = require('./machineReport')
const GenricMachine = require('./genric-machine')
const DispatchOrder = require('./dispatchOrder')
const RejectionReport = require('./rejection')
module.exports = {
    User:User,
    UserAccessToken:UserAccessToken,
    Customer:Customer,
    ChangeLog: ChangeLog,
    Product: Product,
    Material: Material,
    Order:Order,
    DailyProduct:DailyProduct,
    Machine:Machine,
    Worker:Worker,
    MachineReport: MachineReport,
    GenricMachine:GenricMachine,
    DispatchOrder:DispatchOrder,
    RejectionReport:RejectionReport
}