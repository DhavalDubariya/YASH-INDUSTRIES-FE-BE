const router = require("express").Router();
const customerDb = require('./customer.db')
const libFunction = require('../../helpers/libFunction');
const db = require('../../model/index')


function errorMessage(params) {
return {
    status: false,
    error:
    params != undefined
        ? params
        : "something went wrong",
};
}

const createCustomerModule = async(req) => {
    var userId = req.user_id
    var customerName = req.body.customer_name
    var companyName = req.body.company_name
    var phoneNumber = req.body.phone_number
    var city = req.body.city
    var address = req.body.address
    
    var requireField = [customerName,phoneNumber]
    var validate = await libFunction.objValidator(requireField)

    if(validate == false){
        return errorMessage("Invalid Param Passed.")
    }
    var changeLogId = await db.ChangeLog.create({user_id:userId})
    var customerObj = {
        company_name:companyName.trim() == "" || undefined ? null :  companyName.trim(),
        customer_name: customerName.trim() == "" || undefined ? null :   customerName.trim(),
        phone_number: phoneNumber.trim() == "" || undefined ? null :    phoneNumber.trim(),
        city:  city.trim() == "" || undefined ? null : city.trim(),
        address: address.trim() == "" || undefined ? null : address.trim(),
        change_log_id:changeLogId._id 
    }
    var createCustomer = await db.Customer.create(customerObj)
    if(createCustomer==null){
        return {
            status:false,
            error:"Error while creating customer"
        }
    }
    var customerList = await getCustomerModule(req)

    return customerList
}

const getCustomerModule = async(req) => {
    var customerList = await db.Customer.find({history_id:null,flag_deleted:false})
    return {status:true,data:customerList}
}

const getCustomerDetailModule = async(req) => {
    var customerId = req.query.customerId

    if(customerId == undefined || customerId == null || customerId == ""){
        return {
            status:false,
            error:"Invalid param passed"
        }
    }

    var customerDetail = await db.Customer.findOne({_id:customerId})

    if(customerDetail == null){
        return {
            status:false,
            error:"Customer not found."
        }
    }

    var result = {
        status:true,
        data:customerDetail
    }

    return result
}

const updateCustomerModule = async(req) => {
    var userId = req.user_id
    var customerId = req.body.customer_id
    var customerName = req.body.customer_name
    var companyName = req.body.company_name
    var phoneNumber = req.body.phone_number
    var city = req.body.city
    var address = req.body.address 
    var requireField = [customerName,phoneNumber,customerId]
    var validate = await libFunction.objValidator(requireField)
    if(validate == false){
        return errorMessage("Invalid Param Passed.")
    }
    
    var customerDetail = await db.Customer.findOne({_id:customerId})
    if(customerDetail==null){
        return {
            status:false,
            error:"Customer not found"
        }
    }
    
    await libFunction.HistoryGenerator(db.Customer,customerDetail._id)

    var changeLogId = await db.ChangeLog.create({user_id:userId})
    var customerObj = {
        company_name:companyName.trim() == "" || undefined ? null :  companyName.trim(),
        customer_name: customerName.trim() == "" || undefined ? null :   customerName.trim(),
        phone_number: phoneNumber.trim() == "" || undefined ? null :    phoneNumber.trim(),
        city:  city.trim() == "" || undefined ? null : city.trim(),
        address: address.trim() == "" || undefined ? null : address.trim(),
        change_log_id:changeLogId._id 
    }
    var updateCustomer = await db.Customer.updateOne({_id:customerId},{ $set: customerObj })
    if(updateCustomer == null){
        return {
            status:false,
            error:"Error While Updating Customer"
        }
    }
    var customerList = await getCustomerModule(req)
    return customerList
}

module.exports = {
    createCustomerModule:createCustomerModule,
    getCustomerModule:getCustomerModule,
    getCustomerDetailModule:getCustomerDetailModule,
    updateCustomerModule:updateCustomerModule
}