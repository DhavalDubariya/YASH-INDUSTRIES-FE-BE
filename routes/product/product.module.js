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
    var userId = req.user_id
    var productName = req.body.product_name
    var productQuantity = req.body.product_quantity
    var runner = req.body.runner
    var customerId = req.body.customer_id

    var changeLogId = (await db.ChangeLog.create({user_id:userId})).toObject()

    var orderNo = await db.Order.aggregate([
        { $group: { _id: null, maxOrderNo: { $max: "$order_no" } } }
      ]);
      
    var newOrderNo = orderNo.length > 0 ? orderNo[0].maxOrderNo + 1 : 1;
    console.log(req.body,newOrderNo, orderName, userId,changeLogId._id)
    var orderName = Math.random()
    var deliveryDate = req.body.delivery_date
    var driverName = req.body.driver_name
    
    var requireFieldOrder = [newOrderNo, orderName, userId,changeLogId._id]
    var validate = await libFunction.objValidator(requireFieldOrder)

    if (validate == false) {
        return errorMessage("Invalid Params for Order")
    }

    // material array
    var materialArray = req.body.material

    materialArray.map(async(material) => {
        var materialName = material.material_name
        var materialColor = material.material_color
        var materialQty = material.material_qty

        var requireFieldMaterial = [materialName, materialColor, materialQty]
        var validate = await libFunction.objValidator(requireFieldMaterial)

        if (validate == false) {
            return errorMessage("Invalid Params for Material")
        }
    })
    // order object
    var orderObj = {
        order_no: newOrderNo,
        order_name: orderName,
        delivery_date: deliveryDate,
        driver_name: driverName,
        customer_id: customerId,
        change_log_id:changeLogId._id
    }
    var createOrder = await db.Order.create(orderObj)
    if (createOrder == null) {
        return {
            status: false,
            error:"Error while creating order"
        }
    }

    var orderId = createOrder._id // OrderId fetch from order


    var requireFieldProduct = [productName, productQuantity, runner, orderId]
    var validate = await libFunction.objValidator(requireFieldProduct)

    if (validate == false) {
        return errorMessage("Invalid Params for Product")
    }
    
    var productObj = {
        product_name:productName.trim() == "" || undefined ? null : productName.trim(),
        product_qty:productQuantity == "" || undefined ? null : productQuantity,
        runner: runner == "" || undefined ? null : runner,
        order_id: orderId == "" || undefined ? null : orderId,
        change_log_id:changeLogId.id = "" || undefined ? null : changeLogId
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
            product_id:productId,
            change_log_id: changeLogId._id,
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

    var createdMaterial = await Promise.all(materialPromise)
    console.log(createdMaterial);
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

    return {status:true,data:[]}
}

const getOrderListModule = async (req) => {
    var customerId = req.query.customer_id
    console.log(customerId);
    if (!customerId) {
        return {
            status: false,
            message:"Customer Id "
        }
    }
    var orderObj = JSON.parse(JSON.stringify(await db.Order.find({ history_id:null,flag_deleted:false,customer_id:customerId})))

    if(orderObj == null){
        return {
            status:true,
            data:[]
        }
    }

    var productCount = JSON.parse(JSON.stringify(await db.Product.find({history_id:null,flag_deleted:false,order_id:{ $in: orderObj.map( x => x._id )}} )))

    var changeLogId = JSON.parse(JSON.stringify(await db.ChangeLog.find({_id:{$in:orderObj.map( x => x.change_log_id )}})))

    var userDetail = JSON.parse(JSON.stringify(await db.User.find({_id:{$in:changeLogId.map( x => x.user_id)}})))

    userDetail = changeLogId.map( x => {
        var userDetailFilter = userDetail.filter( y => y._id == x.user_id ) 
        if(userDetailFilter.length != 0 ){
            x["user_detail"] = userDetailFilter[0]
            return x
        }
    })
    // console.log(changeLogId)
    var orderObjMap = await Promise.all(orderObj.map(async x => {
        x["flag_status"] = x.approved_by != null ? true : false,
        x["product_count"] = productCount.filter( y => y.order_id == x._id ).length
        x["user_name"] = userDetail.filter( y => y._id == x.change_log_id)[0]?.user_detail.name
        x["timestamp"] = await libFunction.formatDateTimeLib(x.timestamp)
        delete x.history_id
        delete x.flag_deleted
        delete x.change_log_id
        delete x.flag_status
        return x
    }))
    
    return {status:true,data:orderObjMap}
}

const getProductModule = async (req) => {
    var productId = req.query.productId
    if (!productId) {
        return {
            status: false,
            message:"Product Id "
        }
    }
    console.log(productId)
    var productCount = JSON.parse(JSON.stringify(await db.Product.find({ flag_deleted: false, history_id: null, _id: productId } )))
    console.log(productCount,'::::::::::::::::::::::::::::')
    if(productCount.length == 0){
        return {status:true,data:[]}
    }
    productCount = productCount[0]
    var productMatirial = JSON.parse(JSON.stringify(await db.Material.find({history_id:null,flag_deleted:false,product_id:[productCount._id]} )))
    
    // console.log(changeLogId)
    
    productCount.material = productMatirial

    return {status:true,data:productCount}
}

const addProductModule = async (req) => {
    var orderId = req.query.order_id

    var userId = req.user_id
    var productName = req.body.product_name
    var productQuantity = req.body.product_quantity
    var runner = req.body.runner
    var changeLogId = (await db.ChangeLog.create({user_id:userId})).toObject()

    var requiredFieldProduct = [productName, productQuantity, runner, changeLogId,orderId]
    var validate = await libFunction.objValidator(requiredFieldProduct)

    if (!validate) {
        return errorMessage("Invalid Params for Product")
    }

    var findProduct = await db.Product.find({ order_id: orderId })
    
    if (!findProduct) {
        return errorMessage("Product Not Found")
    }

    var productObj = {
        product_name: productName,
        product_qty: productQuantity,
        runner: runner,
        order_id: orderId,
        change_log_id: changeLogId,
    }

    var createProduct = await db.Product.create(productObj)

    if (!createProduct) {
        return errorMessage("Product is Not Created")
    }

    var productId = createProduct._id
    var materialArray = req.body.material

    materialArray.map(async (material) => {
        
        var materialName = material.material_name
        var materialColor = material.material_color
        var materialQty = material.material_qty

        var requireFieldMaterial = [materialName, materialColor, materialQty]
        var validate = await libFunction.objValidator(requireFieldMaterial)

        if (validate == false) {
            return errorMessage("Invalid Params for Material")
        }
    })

    var materialPromise = materialArray.map(async (material) => {
        var materialObj = {
            material_name: material.material_name,
            material_color: material.material_color,
            material_qty: material.material_qty,
            product_id:productId,
            change_log_id: changeLogId._id,
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

    var createdMaterial = await Promise.all(materialPromise)

    var responseObj = {
        product_name: createProduct.product_name,
        product_quantity: createProduct.product_qty,
        runner: createProduct.runner,
        order_id:orderId,
    }

    responseObj.material = createdMaterial.map(material => ({
        material_name: material.material_name,
        material_color: material.material_color,
        material_qty:material.material_qty
    }))

    return responseObj

}

const orderDetailModule = async(req) => {
    var customerId = req.query.customerId
    var orderId = req.query.orderId
    console.log(customerId);
    if (!customerId || !orderId ) {
        return {
            status: false,
            message:"Customer Id "
        }
    }
    var orderObj = JSON.parse(JSON.stringify(await db.Order.find({ history_id:null,flag_deleted:false,customer_id:customerId,_id:orderId})))

    if(orderObj.length == 0){
        return {
            status:true,
            data:[]
        }
    }

    var productCount = JSON.parse(JSON.stringify(await db.Product.find({history_id:null,flag_deleted:false,order_id:{ $in: orderObj.map( x => x._id )}} )))

    var changeLogId = JSON.parse(JSON.stringify(await db.ChangeLog.find({_id:{$in:orderObj.map( x => x.change_log_id )}})))

    var userDetail = JSON.parse(JSON.stringify(await db.User.find({_id:{$in:changeLogId.map( x => x.user_id)}})))

    var productMatirial = JSON.parse(JSON.stringify(await db.Material.find({history_id:null,flag_deleted:false,product_id:{ $in: productCount.map( x => x._id )}} )))
    
    userDetail = changeLogId.map( x => {
        var userDetailFilter = userDetail.filter( y => y._id == x.user_id ) 
        if(userDetailFilter.length != 0 ){
            x["user_detail"] = userDetailFilter[0]
            return x
        }
    })
    // console.log(changeLogId)
    var orderObjMap = await Promise.all(orderObj.map(async x => {
        x["flag_status"] = x.approved_by != null ? true : false,
        x["product_count"] = productCount.filter( y => y.order_id == x._id ).length
        x["user_name"] = userDetail.filter( y => y._id == x.change_log_id)[0]?.user_detail.name
        x["timestamp"] = await libFunction.formatDateTimeLib(x.timestamp)
        x["product"] = productCount.map( y => {
            var materialFilter = productMatirial.filter( z => y._id == z.product_id )
            y["material"] = materialFilter
            y["customer_id"] = customerId
            return y
        })
        delete x.history_id
        delete x.flag_deleted
        delete x.change_log_id
        delete x.flag_status
        return x
    }))
    
    return {status:true,data:orderObjMap[0]}
}

module.exports = {
    createproductModule: createproductModule,
    getProductModule: getProductModule,
    getOrderListModule: getOrderListModule,
    addProductModule: addProductModule,
    orderDetailModule:orderDetailModule
}