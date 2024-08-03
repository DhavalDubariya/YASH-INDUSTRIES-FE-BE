const router = require("express").Router();
const productDb = require('./product.db')
const libFunction = require('../../helpers/libFunction');
const db = require('../../model/index');
const { json } = require("express");
const { ObjectId, Db } = require("mongodb");
const fs = require('fs')
const path = require('path')
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
    
    var dayilyProduct = JSON.parse(JSON.stringify(await db.DailyProduct.find({history_id:null,flag_deleted:false,product_id:{ $in: productCount.map( x => x._id )}})))
    var machineCount = 0
    var dayilyProductMap = []
    if(dayilyProduct.length != 0){
        var machineProductCount = JSON.parse(JSON.stringify(await db.MachineReport.find({flag_deleted:false,history_id:null,daily_product_id:{$in:dayilyProduct.map(x => x._id)}})))
        // console.log(machineProductCount)
        var rejectionProduct = JSON.parse(JSON.stringify(await db.RejectionReport.find({history_id:null,flag_deleted:false,daily_product_id:{$in:dayilyProduct.map(x => x._id)}})))

        dayilyProductMap = dayilyProduct.map( x => {
            x["machineProductCount"] = machineProductCount.filter( y => y.daily_product_id == x._id )
            // console.log(dayilyProductMap.map(y => y._id).includes(x._id))
            x["rejectionProduct"] = rejectionProduct.filter( y => y.daily_product_id == x._id )
            if(dayilyProductMap.map(y => y._id).includes(x._id)==false){
                if(x["machineProductCount"].length != 0){
                    x["machineProductCount"][0]["rejectionProduct"] = x["rejectionProduct"]
                    return x
                }
            }
        }).filter( x => x != null )
        // console.log(dayilyProductMap[0])
    }

    var dispatchProduct = JSON.parse(JSON.stringify(await db.DispatchOrder.find({history_id:null,flag_deleted:false,order_id:{ $in: orderObj.map( x => x._id )}})))

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
            var productFinalCount = 0
            var productionCount = dayilyProductMap.filter( z => z.product_id == y._id )
            var rejectionCount = 0
            if(productionCount.length != 0){
                var machineProductCount = productionCount.map( z => z.machineProductCount ).flat()
                if(machineProductCount.length != 0){
                    machineProductCount.map( z => z.rejectionProduct ).flat().map( z => z?.rejection_count ).filter( z => z != undefined ).map( z => rejectionCount = rejectionCount + z )
                    machineProductCount.map( z => productFinalCount = productFinalCount + z.machine_count )
                }
            }

            var dispatchProductCount = 0
            if(dispatchProduct.length != 0){
                var dispatchProductMap = dispatchProduct.map( z => z.products).flat()
                if(dispatchProductMap.length != 0){
                   var dispatchProductMapFilter = dispatchProductMap.filter( z => z.product_id == y._id )
                   if(dispatchProductMapFilter.length != 0){
                        dispatchProductMapFilter.map( z => dispatchProductCount = dispatchProductCount + z.product_count )
                   }
                }
            } 
            console.log(productFinalCount,rejectionCount,'::::::::::::::::::::')
            var materialFilter = productMatirial.filter( z => y._id == z.product_id )
            y["material"] = materialFilter
            y["customer_id"] = customerId
            y["production_count"] = (productFinalCount-rejectionCount)
            y["dispatch_count"] = dispatchProductCount
            y["rejection_count"] = rejectionCount
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
    var copId = req.body.daily_product_id
    var machineId = req.body.machine_id
    var flagDayShift = req.body.flag_day_shift
    var machineTimeId = req.body.machine_time_id
    var count = req.body.product_count
    var workerId = req.body.worker_id
    var reason = req.body.reason
    var userId = req.user_id
    if (iDate == undefined || iDate == null || iDate == "" || copId == undefined || copId == null || copId == '' || machineId == undefined || machineId == null || machineId == "" ||  machineTimeId == undefined || machineTimeId == null || machineTimeId == "") { 
        return errorMessage("Somthing want wrong")
    }
    var changeLogId = (await db.ChangeLog.create({user_id:userId})).toObject()

    // await db.MachineReport.deleteMany({})
    req.body.change_log_id = changeLogId._id
    req.body.worker_id = req.body.worker_id == 'null' || undefined || '' ? null :  new ObjectId(req.body.worker_id)
    console.log(req.body)
    
    var machineReport = await db.MachineReport.findOne({"machine_time_id":new ObjectId(req.body.machine_time_id),"iDate":new Date(req.body.iDate),"daily_product_id":new ObjectId(req.body.daily_product_id),"machine_id":new ObjectId(req.body.machine_id)})
    
    if(machineReport == null){
        var createMachineReport = await db.MachineReport.create(req.body)
        // console.log(createMachineReport)
        if(createMachineReport == null){
            return errorMessage()
        }
    }else{
        req.body.worker_id = req.body.worker_id == 'null' || undefined || '' ? null :  new ObjectId(req.body.worker_id)
        var updateMachineReport = await db.MachineReport.updateOne({_id:machineReport._id},{"worker_id":req.body.worker_id,"reason":req.body.reason,"machine_count":req.body.machine_count})
        // console.log(updateMachineReport)
        if(updateMachineReport == null){
            return errorMessage()
        }
    }
    
    
    
    return {status:true,data:[]}
}

const getMachineDataModule = async(req) => {
    var getGenricTime = await JSON.parse(JSON.stringify(await db.GenricMachine.find({})))
    var machineReport = await JSON.parse(JSON.stringify(await db.MachineReport.find({"iDate":new Date(req.body.iDate),"daily_product_id":new ObjectId(req.body.daily_product_id),"machine_id":new ObjectId(req.body.machine_id)})))
    console.log(machineReport,'-------------------')
    var result = getGenricTime.map( x => {
         var machineFilter = machineReport.filter(y => y.machine_time_id == x._id)
         var machineDataObj = {
            machine_count:null,
            reason:null,
            worker_id:null
        }
        if(machineFilter.length != 0){
            machineDataObj.machine_count = machineFilter[0].machine_count
            machineDataObj.reason = machineFilter[0].reason
            machineDataObj.worker_id = machineFilter[0].worker_id
        }
        return {...x,...machineDataObj}
    })
    var getWorker = JSON.parse(JSON.stringify(await db.Worker.find({flag_deleted:false,history_id:null})))
    var rejectionReport = await JSON.parse(JSON.stringify(await db.RejectionReport.find({"iDate":new Date(req.body.iDate),"daily_product_id":new ObjectId(req.body.daily_product_id),"machine_id":new ObjectId(req.body.machine_id)})))
    return {status:true,data:result,worker:getWorker,rejection:rejectionReport}
    // return {status:true,data:result}
}

const dispatchOrderModule = async(req) => {
    var userId = req.user_id
    var iDate = req.body.iDate
    var driver_name = req.body.driver_name
    var number_plate = req.body.number_plate
    var products = req.body.products
    var order_id = req.body.order_id
    var changeLogId = (await db.ChangeLog.create({user_id:userId})).toObject()

    console.log(req.body) 
    if(iDate == undefined || iDate == null || iDate == '' || driver_name == '' || driver_name == null || driver_name == undefined || number_plate == '' || number_plate == undefined || number_plate == null || order_id == null || order_id == undefined || order_id == '' || products.length == 0){
        return errorMessage()
    }
    req.body.change_log_id = changeLogId._id
    var dispatchOrder = await db.DispatchOrder.create(req.body)
    if(dispatchOrder == null){
        return dispatchOrder
    }
    return {status:true,data:[]}
}

const getdispatchOrderModule = async(req) => {
    var dispatchOrder = await JSON.parse(JSON.stringify(await db.DispatchOrder.find({history_id:null,flag_deleted:false})))
    dispatchOrder = dispatchOrder.filter(x => x._id == '66adf9eab8c93ccbfe185d2b')
    console.log(dispatchOrder[0].products)
    var productName = await db.Product.find({ _id :{$in: dispatchOrder.map( x => x.products.map( y => y.product_id )).flat()} })
    // console.log(productName)
    var orderDetail = await JSON.parse(JSON.stringify(await db.Order.find({ _id :{$in: dispatchOrder.map( x => x.order_id)} })))
    // console.log(orderDetail)
    var customerDetail = await JSON.parse(JSON.stringify(await db.Customer.find({ _id :{$in: orderDetail.map( x => x.customer_id)} })))
    orderDetail = orderDetail.map( x => {
        var customerDetailFilter = customerDetail.filter( y => y._id == x.customer_id )
        x["customer_name"] = customerDetailFilter[0]?.customer_name
        x["company_name"] = customerDetailFilter[0]?.company_name
        return x
    })
    var dataArray = []
    for(let i=0;i<dispatchOrder.length;i++){
        var productArray = []
        dispatchOrder[i]["order_no"] = orderDetail.filter(x => x._id == dispatchOrder[i].order_id)[0]?.order_no
        dispatchOrder[i]["customer_name"] = orderDetail.filter(x => x._id == dispatchOrder[i].order_id)[0]?.customer_name
        dispatchOrder[i]["company_name"] = orderDetail.filter(x => x._id == dispatchOrder[i].order_id)[0]?.company_name
        for(let j=0;j<dispatchOrder[i].products.length;j++){
            var productFilter = productName.filter( x => x._id == dispatchOrder[i].products[j].product_id)
            console.log(dispatchOrder[i].products[j].product_count,':::::::::::::;;;')
            productFilter[0].product_qty = dispatchOrder[i].products[j].product_count
            productArray.push(productFilter[0])
        }
        dispatchOrder[i]["products"] = productArray
        dataArray.push(dispatchOrder[i])
    }
    return {status:true,data:dataArray}
}

const getDailyMachineReportModule = async(req) => {
    const iDate = req.query.iDate
    var machine = await JSON.parse(JSON.stringify(await db.Machine.find({flag_deleted:false})))
    var getGenricTime = await JSON.parse(JSON.stringify(await db.GenricMachine.find({})))
    var machineReport = await JSON.parse(JSON.stringify(await db.MachineReport.find({"iDate":new Date(iDate)})))
    var getWorker = await JSON.parse(JSON.stringify(await db.Worker.find({flag_deleted:false,history_id:null})))
    var getDailyProduct = await JSON.parse(JSON.stringify(await db.DailyProduct.find({flag_deleted:false,history_id:null,iDate:new Date(iDate)})))
    
    var product = await JSON.parse(JSON.stringify(await db.Product.find({_id:{$in:getDailyProduct.map( x => x.product_id )}})))
        // console.log(product)
    var rejection = await JSON.parse(JSON.stringify(await db.RejectionReport.find({flag_deleted:false,history_id:null,"iDate":new Date(iDate)})))
    // console.log(machineReport)
    var dataArray = []
    for(let i=0;i<machine.length;i++){
        var dataObj =  {
            "machine_id":machine[i]._id,
            "machine_name":machine[i].machine_name,
            "daily_product":[]
        }
        for(let j=0;j<getDailyProduct.length;j++){
            var dayilyProductObj = {
                "product_id":getDailyProduct[j].product_id,
                "daily_product_id":getDailyProduct[j]._id,
                "product_name":product.filter( x => x._id ==  getDailyProduct[j].product_id)[0]?.product_name,
                "machine_time":[],
                "rejection":rejection.filter( x => x.daily_product_id == getDailyProduct[j]._id)
            }
            var flagInsert = []
            for(k=0;k<getGenricTime.length;k++){
                var machineTimeObj = {
                    "machine_time_id": getGenricTime[k]._id,
                    "machine_time": getGenricTime[k].machine_time,
                    "flag_day_shift": getGenricTime[k].flag_day_shift,
                    "machine_time_seq": getGenricTime[k].seq_no,
                    "machine_report":[]
                }
                // console.log(getGenricTime[k]._id,machine[i]._id,getDailyProduct[j]._id)
                var machineFilter =  machineReport.filter(y => y.machine_time_id == getGenricTime[k]._id && y.machine_id == machine[i]._id && getDailyProduct[j]._id == y.daily_product_id )
                // console.log(machineFilter,':::::::::::::::::')
                if(machineFilter.length != 0){
                    if(machineFilter[0].machine_count == 0 && (machineFilter[0].reason == null || machineFilter[0].reason.trim() == '' || machineFilter[0].worker_id == null)){
                        flagInsert = false
                    }else{
                        flagInsert = true
                    }
                    var machineReportObj = {
                        "machine_count": machineFilter[0].machine_count,
                        "reason": machineFilter[0].reason,
                        "iDate": machineFilter[0].iDate,
                        "worker_id": machineFilter[0].worker_id,
                        "worker_name": getWorker.filter( x => x._id ==  machineFilter[0].worker_id )[0]?.worker_name
                    }
                    machineTimeObj.machine_report.push(machineReportObj)
                }
                dayilyProductObj.machine_time.push(machineTimeObj)
            }
            if(flagInsert == true){
                dayilyProductObj.machine_time.sort( (x,y) => x.machine_time_seq - y.machine_time_seq )
                dataObj.daily_product.push(dayilyProductObj)
            }
        }
        dataArray.push(dataObj)
    }
    data = dataArray
    
    var tableArray = []
    for(let i=0;i<data.length;i++){
        // console.log(data[i].machine_name,'::::::::::::::::::')
        // var tableData = tableData.replaceAll('{{machineName}}',data[i].machine_name)
        for(let j=0;j<data[i].daily_product.length;j++){
        var tableDataStrucher = fs.readFileSync(path.join(__dirname,'../../public/table-strachure-table.html'),'utf8')
          console.log(data[i].machine_name)
          console.log(data[i].daily_product[j].product_name)
          tableDataStrucher = tableDataStrucher.replaceAll('{{machinName}}',data[i].machine_name)
          tableDataStrucher = tableDataStrucher.replaceAll('{{productName}}',data[i].daily_product[j].product_name)

          var machineTime = data[i].daily_product[j].machine_time.filter( x => x.flag_day_shift == true )
          var rejectionCount = data[i].daily_product[j].rejection.filter( x => x.flag_day_shift == true )
          rejectionCount = rejectionCount.length == 0 ? 0 : rejectionCount[0].rejection_count
          var machinCount = ''
          var machinWorker = ''
          var machineReason = ''
          var machinCountTotal = 0
          for(let k=0;k<machineTime.length;k++){
            // console.log(machineTime[k].machine_time.length)
            machinCountTotal = machinCountTotal + (machineTime[k].machine_report.length == 0 ? 0 : machineTime[k].machine_report[0].machine_count == null ? 0 : machineTime[k].machine_report[0].machine_count)
            machinCount = machinCount + `
              <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
                ${machineTime[k].machine_report.length == 0 ? '' : machineTime[k].machine_report[0].machine_count == null ? '' : machineTime[k].machine_report[0].machine_count}
              </td>
            `
            machinWorker = machinWorker + `
              <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
                ${machineTime[k].machine_report.length == 0 ? '' : machineTime[k].machine_report[0].worker_name == null ? '' : machineTime[k].machine_report[0].worker_name}
              </td>
            `
            machineReason = machineReason + `
              <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
                ${machineTime[k].machine_report.length == 0 ? '' : (machineTime[k].machine_report[0].reason == (null || ''))  ? '' : machineTime[k].machine_report[0].reason}
              </td>
            `
          }
          tableDataStrucher = tableDataStrucher.replaceAll('{{machinCount}}',machinCount)
          tableDataStrucher = tableDataStrucher.replaceAll('{{machinWorker}}',machinWorker)
          tableDataStrucher = tableDataStrucher.replaceAll('{{machineReason}}',machineReason)
          tableDataStrucher = tableDataStrucher.replaceAll('{{machinCountTotal}}',(machinCountTotal-rejectionCount))
          tableDataStrucher = tableDataStrucher.replaceAll('{{rejectionCount}}',rejectionCount)
          
          var machineNightTime = data[i].daily_product[j].machine_time.filter( x => x.flag_day_shift == false)
          var rejectionNightCount = data[i].daily_product[j].rejection.filter( x => x.flag_day_shift == false )
          rejectionNightCount = rejectionNightCount.length == 0 ? 0 : rejectionNightCount[0].rejection_count
          var machineNightCount = ''
          var machinNightWorker = ''
          var machinNightReason = ''
          var machinNightCountTotal = 0

          for(let k=0;k<machineNightTime.length;k++){
            machinNightCountTotal = machinNightCountTotal + (machineNightTime[k].machine_report.length == 0 ? 0 : machineNightTime[k].machine_report[0].machine_count == null ? 0 : machineNightTime[k].machine_report[0].machine_count)
            // console.log(machineNightTime[k].machine_time.length)
            machineNightCount = machineNightCount + `
              <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
                ${machineNightTime[k].machine_report.length == 0 ? '' : machineNightTime[k].machine_report[0].machine_count == null ? '' : machineNightTime[k].machine_report[0].machine_count}
              </td>
            `
            machinNightWorker = machinNightWorker + `
              <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
                ${machineNightTime[k].machine_report.length == 0 ? '' : machineNightTime[k].machine_report[0].worker_name == null ? '' : machineNightTime[k].machine_report[0].worker_name}
              </td>
            `
            machinNightReason = machinNightReason + `
              <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
                ${machineNightTime[k].machine_report.length == 0 ? '' : (machineNightTime[k].machine_report[0].reason == (null || ''))  ? '' : machineNightTime[k].machine_report[0].reason}
              </td>
            `
          }
    
          tableDataStrucher = tableDataStrucher.replaceAll('{{machineNightCount}}',machineNightCount)
          tableDataStrucher = tableDataStrucher.replaceAll('{{machineNightWorker}}',machinNightWorker)
          tableDataStrucher = tableDataStrucher.replaceAll('{{machineNightReason}}',machinNightReason)
          tableDataStrucher = tableDataStrucher.replaceAll('{{machinNightCountTotal}}',(machinNightCountTotal-rejectionNightCount))
          tableDataStrucher = tableDataStrucher.replaceAll('{{rejectionNightCount}}',rejectionNightCount)


          tableArray.push(tableDataStrucher)
        }
    }
    return tableArray.join('')
}

const rejectionCountModule = async(req) => {
    var iDate = req.body.iDate
    var copId = req.body.daily_product_id
    var machineId = req.body.machine_id
    var flagDayShift = req.body.flag_day_shift
    var count = req.body.rejection_count
    
    var userId = req.user_id
    if (iDate == undefined || iDate == null || iDate == "" || copId == undefined || copId == null || copId == '' || machineId == undefined || machineId == null || machineId == "") { 
        return errorMessage("Somthing want wrong")
    }
    var changeLogId = (await db.ChangeLog.create({user_id:userId})).toObject()

    // await db.MachineReport.deleteMany({})
    req.body.change_log_id = changeLogId._id

    var rejectionReport = await db.RejectionReport.findOne({"iDate":new Date(req.body.iDate),"daily_product_id":new ObjectId(req.body.daily_product_id),"machine_id":new ObjectId(req.body.machine_id),"flag_day_shift":flagDayShift})
    
    if(rejectionReport == null){
        var createRejectionReport = await db.RejectionReport.create(req.body)
        // console.log(createMachineReport)
        if(createRejectionReport == null){
            return errorMessage()
        }
    }else{
        var updateRejectionReport = await db.RejectionReport.updateOne({_id:rejectionReport._id},{"rejection_count":req.body.rejection_count})
        // console.log(updateMachineReport)
        if(updateRejectionReport == null){
            return errorMessage()
        }
    }

    return {status:true,data:[]}
}

const stockTackModule = async(req) => {

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
    createMachineReportModule:createMachineReportModule,
    getMachineDataModule:getMachineDataModule,
    dispatchOrderModule:dispatchOrderModule,
    getdispatchOrderModule:getdispatchOrderModule,
    getDailyMachineReportModule:getDailyMachineReportModule,
    rejectionCountModule:rejectionCountModule,
    stockTackModule:stockTackModule
}