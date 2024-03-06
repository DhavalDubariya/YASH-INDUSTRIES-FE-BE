const router = require("express").Router();
const productDb = require('./product.db')
const libFunction = require('../../helpers/libFunction');
const db = require('../../model/index')


const createproductModule = async(req) => {
    var obj = {
        "product_name": "Dhaval",
        "product_quantity": "1",
        "runner": "1",
        "customer_id": "65d1d3473df68937116f7b2e",
        "material": [
            {
                "material_name": "1",
                "material_color": "1",
                "material_qty": "1"
            }
        ]
    }

    var productName = req.body.product_name
    var productQuantity = req.body.product_quantity
    var runner = req.body.runner
    var customerId = req.body.customer_id
    var orderId = req.body.order_id
    var material = req.body.material
    
    
    
}

module.exports = {
    createproductModule:createproductModule
}