const router = require("express").Router();
const productDb = require('./product.db')
const libFunction = require('../../helpers/libFunction');
const db = require('../../model/index');
const { json } = require("express");

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
    var orderId = req.body.order_id
    var changeLogId = (await db.ChangeLog.create({user_id:userId})).toObject()

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
    

    var createOrder = await db.Order.findOne({_id:orderId,history_id:null,flag_deleted:false})

    if(createOrder == null){
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

    return {status:true,data:{customer_id:customerId,order_id:orderId}}
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
    // console.log(productId)
    var productCount = JSON.parse(JSON.stringify(await db.Product.find({ flag_deleted: false, history_id: null, _id: productId } )))
    // console.log(productCount,'::::::::::::::::::::::::::::')
    if(productCount.length == 0){
        return {status:true,data:[]}
    }
    productCount = productCount[0]
    var productMatirial = JSON.parse(JSON.stringify(await db.Material.find({history_id:null,flag_deleted:false,product_id:[productCount._id]} )))
    
    // console.log(changeLogId)
    
    productCount.material = productMatirial

    return {status:true,data:productCount}
}

const updateProductModule = async (req) => {
    var userId = req.user_id
    var productName = req.body.product_name
    var productQuantity = req.body.product_quantity
    var runner = req.body.runner
    var customerId = req.body.customer_id
    var productId = req.body.product_id

    if(productId == undefined || productId == "" || productId == null ){
        return errorMessage("Invalid Body")
    }

    var productDetail = JSON.parse(JSON.stringify(await db.Product.findOne({history_id:null,flag_deleted:false,_id:productId})))

    if(productDetail == null){
        return errorMessage("Product Not Found")
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

    var requireFieldProduct = [productName, productQuantity, runner]
    var validate = await libFunction.objValidator(requireFieldProduct)

    if (validate == false) {
        return errorMessage("Invalid Params for Product")
    }
    await libFunction.HistoryGenerator(db.Product,productDetail._id)
    var changeLogId = (await db.ChangeLog.create({user_id:userId})).toObject()
    var productObj = {
        product_name:productName.trim() == "" || undefined ? null : productName.trim(),
        product_qty:productQuantity == "" || undefined ? null : productQuantity,
        runner: runner == "" || undefined ? null : runner,
        change_log_id:changeLogId._id
    }
    
    var updateProduct = await db.Product.updateOne({_id:productId},productObj)
    
    if (updateProduct === null) {
        return {
            status: false,
            error:"Error while creating product"
        }
    }
    // return {status:true,data:[]}
    // var productId = createProduct._id
    var deletePreviousMaterials = await db.Material.updateMany({product_id:productId},{flag_deleted:true,change_log_id:changeLogId._id})
    if(deletePreviousMaterials.status == false){
        return errorMessage("Error While Updating Materials")
    }
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

    return {status:true,data:{customer_id:customerId,order_id:productDetail.order_id}}
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

const getCustomerOrderModule = async(req) => {

    var customerDetail = JSON.parse(JSON.stringify(await db.Customer.find({history_id:null,flag_deleted:false})))

    var orderDetail = JSON.parse(JSON.stringify(await db.Order.find({history_id:null,flag_deleted:false})))

    var productDetail = JSON.parse(JSON.stringify(await db.Product.find({history_id:null,flag_deleted:false})))

    var result = customerDetail.map( x => {
        var orderDetailFilter = orderDetail.filter( y => x._id == y.customer_id )
            var orderDetailFilterMap = orderDetailFilter?.map( y => {
                var productDetailFilter = productDetail?.filter( z => z.order_id == y._id )
                y["product"] = productDetailFilter
                if(productDetailFilter.length != 0){
                    return y
                }
            }).filter( x => x != null )
            x["order"] = orderDetailFilterMap
            if(orderDetailFilterMap.length != 0){
                return x
            }
    }).filter( x => x != null )

    return {status:true,data:result}
}

const createDailyProductModule = async(req) => {
    var userId = req.user_id
    var customerId = req.body.customer_id
    var orderId = req.body.order_idid
    var productId = req.body.product_id    
    var changeLogId = (await db.ChangeLog.create({user_id:userId})).toObject()
    req.body.change_log_id = changeLogId._id

    var daillyOrderProduct = JSON.parse(JSON.stringify(await db.DailyProduct.find({history_id:null,flag_deleted:false,customer_id:customerId,order_id:orderId,product_id:productId})))
    console.log(daillyOrderProduct,':::::::::::::::::::::::::::::::::::::::')
    if(daillyOrderProduct.length != 0){
        return {
            status:false,
            error:"It's already there"
        }
    }

    var createDailyProcuct = await db.DailyProduct.create(req.body)
    if (createDailyProcuct == null) {
        return {
            status: false,
            error:"Error while creating order"
        }
    }
    req["query"]["iDate"] = req.body.iDate
    var getDailyProduct = await getDailyProductModule(req)
    return getDailyProduct
}

const getDailyProductModule = async(req) => {
    var iDate = req.query.iDate
    
    if(iDate == undefined || iDate == null || iDate == ""){
        return errorMessage("Invalid Date")
    }
    console.log(iDate,':::::::::::::::::::::::::::::::::')
    var customerOrderProduct = JSON.parse(JSON.stringify(await db.DailyProduct.find({history_id:null,flag_deleted:false,iDate:iDate})))

    if(customerOrderProduct.length == 0){
        return {
            status:true,
            data:[]
        }
    }

    var customerDetail = JSON.parse(JSON.stringify(await db.Customer.find({history_id:null,flag_deleted:false,_id:{$in:customerOrderProduct.map( x => x.customer_id )}})))

    var orderDetail = JSON.parse(JSON.stringify(await db.Order.find({history_id:null,flag_deleted:false,_id:{$in:customerOrderProduct.map( x => x.order_id )}})))

    var productDetail = JSON.parse(JSON.stringify(await db.Product.find({history_id:null,flag_deleted:false,_id:{$in:customerOrderProduct.map( x => x.product_id )}})))

    for(let i=0;i<customerOrderProduct.length;i++){
        customerOrderProduct[i]["customer_name"] = customerDetail.filter( x => x._id == customerOrderProduct[i].customer_id )[0]?.customer_name
        customerOrderProduct[i]["order_number"] = orderDetail.filter( x => x._id == customerOrderProduct[i].order_id )[0]?.order_no
        customerOrderProduct[i]["product_name"] = productDetail.filter( x => x._id == customerOrderProduct[i].product_id )[0]?.product_name
    }

    return {status:true,data:customerOrderProduct}
}

const genricMachineModule = async(req) => {
    try{

    var machine = JSON.parse(JSON.stringify(await db.Machine.find({flag_deleted:false})))

    if(machine.length == 0){
        return errorMessage()
    }

    var result = {
        status:true,
        data:machine
    }
    return result
    }catch(e){
        console.log(e)
    }
    
}

const getWorkerModule = async(req) => {
    var getWorker = JSON.parse(JSON.stringify(await db.Worker.find({flag_deleted:false,history_id:null})))
    var result = {
        status:true,
        data:getWorker
    }
    return result
}

const machineReportModule = async(req) => {
    var iDate = req.body.iDate
    var dayilyProductId = req.body.daily_product_id
    var flagDayShift = req.body.flag_day_shift

    if(iDate == undefined || iDate == null || iDate == ""){
        return errorMessage("Invalid Date")
    }
    
    var getMachineTime = await JSON.parse(JSON.stringify(await db.MachineReport.find({ flag_deleted: false, iDate: iDate, history_id: null,daily_product_id })))
    return {status:true,data:getMachineTime}
}

const getTimeModule = async (req) => { 
    var getGenricTime = await JSON.parse(JSON.stringify(await db.GenricMachine.find({})))
    var getWorker = JSON.parse(JSON.stringify(await db.Worker.find({flag_deleted:false,history_id:null})))
    return {status:true,data:getGenricTime,worker:getWorker}
}

async function createDailyReport() { 
    await db.GenricMachine.create([
    {machine_time:'08:00',flag_day_shift:true,seq_no:1},
    {machine_time:'09:00',flag_day_shift:true,seq_no:2},
    {machine_time:'10:00',flag_day_shift:true,seq_no:3},
    {machine_time:'11:00',flag_day_shift:true,seq_no:4},
    {machine_time:'12:00',flag_day_shift:true,seq_no:5},
    {machine_time:'13:00',flag_day_shift:true,seq_no:6},
    {machine_time:'14:00',flag_day_shift:true,seq_no:7},
    {machine_time:'15:00',flag_day_shift:true,seq_no:8},
    {machine_time:'16:00',flag_day_shift:true,seq_no:9},
    {machine_time:'17:00',flag_day_shift:true,seq_no:10},
    {machine_time:'18:00',flag_day_shift:true,seq_no:11},
    {machine_time:'19:00',flag_day_shift:true,seq_no:12},
    {machine_time:'20:00',flag_day_shift:false,seq_no:1},
    {machine_time:'21:00',flag_day_shift:false,seq_no:2},
    {machine_time:'22:00',flag_day_shift:false,seq_no:3},
    {machine_time:'23:00',flag_day_shift:false,seq_no:4},
    {machine_time:'24:00',flag_day_shift:false,seq_no:5},
    {machine_time:'01:00',flag_day_shift:false,seq_no:6},
    {machine_time:'02:00',flag_day_shift:false,seq_no:7},
    {machine_time:'03:00',flag_day_shift:false,seq_no:8},
    {machine_time:'04:00',flag_day_shift:false,seq_no:9},
    {machine_time:'05:00',flag_day_shift:false,seq_no:10},
    {machine_time:'06:00',flag_day_shift:false,seq_no:11},
    {machine_time:'07:00',flag_day_shift:false,seq_no:12}
    ])   
}

const createMachineReportModule = async (req) => { 
    var iDate = req.body.iDate
    var copId = req.body.cop_id
    var machineId = req.body.machine_id
    var flagDayShift = req.body.flag_day_shift
    var machineTimeId = req.body.machine_time_id
    var count = req.body.product_count
    var workerId = req.body.worker_id
    var reason = req.body.reason

    if (iDate == undefined || iDate == null || iDate == "" || copId == undefined || copId == null || copId == "" || machineId == undefined || machineId == null || machineId == "" || flagDayShift == undefined || flagDayShift == null || flagDayShift == "" || machineTimeId == undefined || machineTimeId == null || machineTimeId == "") { 
        return errorMessage("Somthing want wrong")
    }

}

module.exports = {
    createproductModule: createproductModule,
    getProductModule: getProductModule,
    getOrderListModule: getOrderListModule,
    updateProductModule: updateProductModule,
    orderDetailModule:orderDetailModule,
    getCustomerOrderModule:getCustomerOrderModule,
    createDailyProductModule:createDailyProductModule,
    getDailyProductModule:getDailyProductModule,
    genricMachineModule:genricMachineModule,
    getWorkerModule:getWorkerModule,
    machineReportModule: machineReportModule,
    getTimeModule: getTimeModule,
    createMachineReportModule:createMachineReportModule
}