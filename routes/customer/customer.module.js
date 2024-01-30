const router = require("express").Router();
const customerDb = require('./customer.db')
const libFunction = require('../../helpers/libFunction')


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

    console.log(req.body)

    return {status:true,data:[]}
}

module.exports = {
    createCustomerModule:createCustomerModule
}