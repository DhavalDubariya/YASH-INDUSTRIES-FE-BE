const User = require('./user')
const UserAccessToken = require('./userAccessToken')
const Customer = require('./customer')
const ChangeLog = require('./changelog')
const Material = require('./material')
const Product = require('./product')
const Order = require('./order')

module.exports = {
    User:User,
    UserAccessToken:UserAccessToken,
    Customer:Customer,
    ChangeLog: ChangeLog,
    Product: Product,
    Material: Material,
    Order:Order,
}