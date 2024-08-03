var customerDetail
var globalData
$(document).ready(async function() {
    $('#datepicker').val((moment(new Date()).format()).split('T')[0])
    var searchParams = new URLSearchParams(window.location.search);
    console.log(Array.from(searchParams),'::::::::::::::::::::::::::::::::::')
    var queryParams = Array.from(searchParams).map( x => { return `${x[0]}=${x[1]}`})
    await $.ajax({
    url: `api/product/order-detail?${queryParams.join('&')}`,
    type: "GET",
    contentType: "application/json",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem("yi-ssid")
    }, // Replace with your data
    success: function(response) {
        // if(response.status == false){
        //     window.location = '/customer'
        // }
        setOrderDetail(response.data)
        setProductList(response.data.product)
        globalData = response.data.product
    },
    error: function(xhr, status, error) {
        // playSound(false)
        window.location = '/customer'
    },
    complete: function() {
        
    }
    });

    $('.material-button').click(function(e){
        var productId = e.target.getAttribute("data-id")
        var globalDataFilter = globalData.filter( x => x._id == productId)[0]?.material
        console.log(globalDataFilter)
        var materialString = ``
        for(let i=0;i<globalDataFilter.length;i++){
            var materialName = globalDataFilter[i].material_name
            var materialColor = globalDataFilter[i].material_color
            var materialQty = globalDataFilter[i].material_qty
            materialString = materialString + `

            <tr class="hover-actions-trigger btn-reveal-trigger position-static">
                <td class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight"><b
                    class="text-body-highlight" style="font-size: 18px; text-align: center !important ; padding: 0 25px;" >
                    ${materialName}
                </b>
                </td>
                <td class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight"><b
                    class="text-body-highlight" style="font-size: 18px; text-align: center !important ; padding: 0 25px;">${materialColor}</b>
                </td>
                <td
                    class="company align-middle white-space-nowrap text-body-tertiary text-opacity-85 ps-4 border-end border-translucent fw-semibold text-body-highlight" style="font-size: 18px; text-align: center !important ; padding: 0 25px;">
                    <b>${materialQty}</b>
                </td>
            </tr>
            `
            $('#material-list').empty()
            $('#material-list').append(materialString)
        }
    })
})

function setOrderDetail(orderDetail) {
    $('#customer-id').val(orderDetail.customer_id)
    $('#order-id').val(orderDetail._id)
    $('#order-no').text(orderDetail.order_no)
    $("#product-count").text(orderDetail.product_count)
    $("#completions-count").text(orderDetail?.completions_count ? orderDetail?.completions_count : '' )
}


function setProductList(productList) {
    var productListString = ''
    for(let i=0;i<productList.length;i++){
        var productName = productList[i].product_name
        var productQty = productList[i].product_qty
        var runner = productList[i].runner
        // var materialLength = productList[i]
        var customerId = productList[i].customer_id
        var productId = productList[i]._id
        productListString = productListString +  `

      <tr data-id="${productId}" class="hover-actions-trigger btn-reveal-trigger position-static">
        <td style="padding: 4px 0px 0px 25px;text-align: center;font-size: 22px;" data-id="${productId}" class="product-id align-middle white-space-nowrap ps-0">
           <b> ${productName} </b>
        </td>
        <td style="padding: 0px !important;">
            <input data-id="${productId}" style="border-radius: 0px !important;" class="form-control input-count dispatch-input" pattern="^[1-9]\d*$" type="number" name="material_qty" id="material_qty" placeholder="Quantity" />
        </td>
        <td style="position: relative;padding: 0px !important;" class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight">
        <div class="form-check form-switch" style="font-size: 25px;position: absolute;top:0%;left: 50%;" >
            <input data-id="${productId}" data-id=true class="form-check-input input-chack dispatch-check" type="checkbox" role="switch" id="flexSwitchCheckDefault">
        </div>
        </td>
      </tr>

        `
        // console.log(customerList)
    }
    productListString = productListString + `
    <tr class="hover-actions-trigger btn-reveal-trigger position-static">
        <td style="padding: 0px !important;" class="name align-middle white-space-nowrap ps-0">
            <input style="border-radius: 0px !important;" class="form-control" pattern="^[1-9]\d*$" type="number" disabled/>
        </td>
        <td style="padding: 0px !important;">
            <input style="border-radius: 0px !important;" class="form-control" pattern="^[1-9]\d*$" type="number" name="material_qty" id="sum-material" disabled/>
        </td>
        <td style="position: relative;padding: 0px !important;" class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight">
            <input style="border-radius: 0px !important;" class="form-control" pattern="^[1-9]\d*$" type="number" name="material_qty" id="material_qty" disabled/>
        </td>
    </tr>
    `
    $('#product-list').empty()
    $('#product-list').append(productListString)
}

$('#creaet-product').on('click',function(e){
    e.preventDefault()
    var customerId = $('#customer-id').val()
    var orderId = $('#order-id').val()
    window.location = `/product?customerId=${customerId}&orderId=${orderId}`
})

$('#dispatch-product').on('click',function(e){
    e.preventDefault()
    var customerId = $('#customer-id').val()
    var orderId = $('#order-id').val()
    window.location = `/dispatch-order?customerId=${customerId}&orderId=${orderId}`
})

$(document).on('change', '.input-count,.input-chack', function(e) {
    var chackDataItem = Array.from(Array.from($('.input-chack')).filter(x => x.checked)).map(element => $(element).attr('data-id'));
    var sum = 0
    var sumOfQty = (chackDataItem.map( x => parseInt($(`.input-count[data-id='${x}']`).val()))).filter( x => isNaN(x) == false ).map( x => sum = sum + x )
    console.log(sum)
    $('#sum-material').val(sum)
});


$(document).on('click','#dispatch-order',function(e){
    var chackDataItem = Array.from(Array.from($('.dispatch-check')).filter(x => x.checked)).map(element => $(element).attr('data-id'));
    var iDate = $('#datepicker').val()
    var driverName = ($('#driver_name').val()).trim()
    var numberPlate = ($('#number_plate').val()).trim()
    var orderId = $('#order-id').val()
    var productArray = []
    for(let i=0;i<chackDataItem.length;i++){
        var itemCount = $(`.dispatch-input[data-id='${chackDataItem[i]}']`).val() 
        itemCount = isNaN(itemCount) == false && parseInt(itemCount) > 0 ? itemCount : 0 
        var materialObj = {
            "product_id":chackDataItem[i],
            "product_count":itemCount
        }
        productArray.push(materialObj)
    }
    if(productArray.length == 0 || driverName == '' || driverName == null || driverName == undefined || numberPlate == '' || numberPlate == undefined || numberPlate == null){
        console.log(productArray,driverName,numberPlate)
        return
    }
    console.log(productArray)
    return productArray
    var result = {
        "iDate":iDate,
        "driver_name":driverName,
        "number_plate":numberPlate,
        "products":productArray,
        "order_id":orderId
    }
    
    $.ajax({
    url: "api/product/dispatch-order",
    type: "POST",
    contentType: "application/json",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem("yi-ssid")
    },
    data: JSON.stringify(result), // Replace with your data
    success: function(response) {
        console.log(response)
        if(response.status == true){
            window.location = "/dispatch"
            showTost(true)
        }else{
            showTost(false)
        }
    },
    error: function(xhr, status, error) {
        showTost(false)
    },
    complete: function() {
        hideLoader()
    }
    });
})