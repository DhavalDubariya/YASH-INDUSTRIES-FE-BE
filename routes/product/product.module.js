const router = require("express").Router();
const productDb = require('./product.db')
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

    // Product Obj Data
    var userId = req.user_id
    var productName = req.body.product_name
    var productQuantity = req.body.product_quantity
    var runner = req.body.runner
    var customerId = req.body.customer_id

    // material array
    var materialArray = req.body.material

    materialArray.map(async(material) => {
        var materialName = material.material_name
        var materialColor = material.material_color
        var materialQty = material.material_qty

        var requireField = [materialName, materialColor, materialQty]
        var validate = await libFunction.objValidator(requireField)

        if (validate == false) {
            return errorMessage("Invalid Params for Material")
        }
    })
    
    var changeLogId = await db.ChangeLog.create({ user_id: userId })
    
    // Order Creation
    // order id => product id
    // product id => material
    // null => error

    // Order Obj Data
    var orderNo = req.body.order_no
    var orderName = req.body.order_name
    var deliveryDate = req.body.delivery_date
    var driverName = req.body.driver_name
    // console.log(req.body);
    var requireField = [orderNo, orderName]
    var validate = await libFunction.objValidator(requireField)

    if (validate == false) {
        return errorMessage("Invalid Params for Order")
    }

    // order object
    var orderObj = {
        order_no: orderNo,
        order_name: orderName,
        delivery_date: deliveryDate,
        driver_name: driverName,
        customer_id:customerId,
        change_log_id:changeLogId
    }
    var createOrder = await db.Order.create(orderObj)

    if (createOrder == null) {
        return {
            status: false,
            error:"Error while creating order"
        }
    }

    var orderId = createOrder._id // OrderId fetch from order


    var requireField = [productName, productQuantity, runner, orderId, changeLogId]
    var validate = await libFunction.objValidator(requireField)

    if (validate == false) {
        return errorMessage("Invalid Params for Product")
    }
    
    var productObj = {
        product_name:productName.trim() == "" || undefined ? null : productName.trim(),
        product_qty:productQuantity == "" || undefined ? null : productQuantity,
        runner: runner == "" || undefined ? null : runner,
        order_id: orderId.trim() == "" || undefined ? null : orderId.trim(),
        change_log_id:changeLogId.id.trim() = "" || undefined ? null : changeLogId.trim()
    }
    
    var createProduct = await db.Product.create(productObj)
    
    if (createProduct === null) {
        return {
            status: false,
            error:"Error while creating product"
        }
    }

    var productId = createProduct._id

    // material data
    var materialPromise = materialArray.map(async (material) => {
        var materialObj = {
            material_name: material.material_name,
            material_color: material.material_color,
            material_qty: material.material_qty,
            product_id:productId
        }
    
        var createMaterial = await db.Material.create(materialObj)
        if (createMaterial === null) {
            return {
                status: false,
                error:"Error while creating material"
            }
        }
        return createMaterial
    })

    // var obj = {
    //     "product_name": "Dhaval",
    //     "product_quantity": "1",
    //     "runner": "1",
    //     "customer_id": "65d1d3473df68937116f7b2e",
    //     "material": [
    //         {
    //             "material_name": "1",
    //             "material_color": "1",
    //             "material_qty": "1"
    //         }
    //     ]
    // }

    var createdMaterial = await Promise.all(materialPromise)

    var responseObj = {
        product_name: createProduct.product_name,
        product_quantity: createProduct.product_qty,
        runner: createProduct.runner,
        customer_id:customerId,
    }

    responseObj.material = createdMaterial.map(material => ({
        material_name: material.material_name,
        material_color: material.material_color,
        material_qty:material.material_qty
    }))

}

module.exports = {
    createproductModule:createproductModule
}