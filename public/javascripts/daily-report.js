var customeOrderProduct
$(document).ready(function(){
    $('#datepicker').val((moment(new Date()).format()).split('T')[0])
    $.ajax({
    url: `api/product/customer-order`,
    type: "GET",
    contentType: "application/json",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem("yi-ssid")
    }, // Replace with your data
    success: function(response) {
        if(response.status == true){
            console.log('Product Detail')
            customeOrderProduct = response.data
            setCOP(response.data)
        }
    },
    error: function(xhr, status, error) {
        // playSound(false)
    },
    complete: function() {
        
    }
    });
    getCustomerOrderProduct((moment(new Date()).format()).split('T')[0])

    $('#close-button').click(function () {
        console.log('::::::::::::::')
        resetCOP()
    })   
})

$('#datepicker').change(function(){
    var date = $('#datepicker').val()
    console.log(date)
    getCustomerOrderProduct(date)
})

function setCOP(cspDate) {
    var customerOption = ([`<option class='customer-option' >SELECT CUSTOMER</option>`].concat(cspDate.map( x => {return `<option data-id='${x._id}' class='customer-option' >${x.customer_name}</option>`} ))).join(' ')
    $('#customer-select').empty()
    $('#customer-select').append(customerOption)
    $('#order-select').attr('disabled',true)
    $('#product-select').attr('disabled',true)
    $('#daily-product-btn').attr('disabled',true)
}

$('#customer-select').change(function(e){
    var customerId = $('#customer-select').find('option:selected').attr('data-id');
    console.log(customerId)
    var orderProductFilter = customeOrderProduct.filter( x => x._id == customerId )
    console.log(orderProductFilter)
    if(orderProductFilter[0]?.order.length != 0){
        var orderOption = ([`<option class='order-option' >SELECT ORDER</option>`].concat(orderProductFilter[0].order.map( x => {return `<option data-id='${x._id}' class='customer-option' ># ${x.order_no}</option>`} ))).join(' ')
        $('#customer-select').attr('disabled',true);
        $('#order-select').attr('disabled',false)
        $('#order-select').empty()
        $('#order-select').append(orderOption)
    }else{
        $('#customer-select').attr('disabled',false);
        $('#order-select').attr('disabled',true)
    }
})

$('#order-select').change(function(e){ 
    var orderId = $('#order-select').find('option:selected').attr('data-id');
    console.log(orderId)
    var productFilter = customeOrderProduct.map( x => { return x.order } ).flat().filter( x => x._id == orderId )
    console.log(productFilter)
    if(productFilter.length != 0 && productFilter[0].product.length != 0 ){
        var productOption = ([`<option class='customer-product' >SELECT PRODUCT</option>`].concat(productFilter[0].product.map( x => {return `<option data-id='${x._id}' class='customer-product' >${x.product_name}</option>`} ))).join(' ')
        $('#order-select').attr('disabled',true);
        $('#product-select').attr('disabled',false)
        $('#product-select').empty()
        $('#product-select').append(productOption)
    }else{
        $('#order-select').attr('disabled',false);
        $('#product-select').attr('disabled',true)
    }
})

$('#product-select').change(function(e){ 
    $('#product-select').attr('disabled',true)
    $('#daily-product-btn').attr('disabled',false)
})

function resetCOP(){
    $('#product-select').attr('disabled',true)
    $('#order-select').attr('disabled',true);
    $('#customer-select').attr('disabled',false);
    $('#customer-select').empty().append(`<option class='order-customer' >SELECT customer</option>`);
    $('#order-select').empty().append(`<option class='order-option' >SELECT ORDER</option>`)
    $('#product-select').empty().append(`<option class='order-product' >SELECT PRODUCT</option>`)
    $('#daily-product-btn').attr('disabled',true)
}

function createDailyProcuct(){
    var productId = $('#product-select').find('option:selected').attr('data-id');
    var orderId = $('#order-select').find('option:selected').attr('data-id');
    var customerId = $('#customer-select').find('option:selected').attr('data-id');
    
    var dailyProduct = {
        "product_id":productId,
        "order_id":orderId,
        "customer_id":customerId,
        "iDate": $('#datepicker').val()
    }

    $.ajax({
        type: "POST",
        url: "api/product/dayily-product",
        data: JSON.stringify(dailyProduct),
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        },
        success: function(response){
            // Handle success
            console.log("Request successful");
            console.log(response);
            if(response.status == true){
                $('#close-button').click()
                setCustomeOrderProduct(response.data)
            }
        },
        error: function(xhr, status, error){
            // Handle errors
            console.log("Request failed");
            console.log(xhr.responseText);
        }
    });
}


function getCustomerOrderProduct(date) {
    $.ajax({
        url: `api/product/dayily-product?iDate=${date}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success: function(response) {
            if(response.status == true){
                console.log(response)
                setCustomeOrderProduct(response.data)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            
        }
        });
}


function setCustomeOrderProduct(copData) {
    $('#product-count').text(`${copData.length} Product`)
    var copString = ``
    for(let i=0;i<copData.length;i++){
        copString = copString + 
        `
        <tr class="hover-actions-trigger btn-reveal-trigger position-static">
            <td class="align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent">${copData[i].customer_name}</td>
            <td class="align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent"># ${copData[i].order_number}</td>
            <td class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight">${copData[i].product_name}</td>
            <td class="company align-middle white-space-nowrap text-body-tertiary text-opacity-85 ps-4 border-end border-translucent fw-semibold text-body-highlight">
            <button class="btn btn-phoenix-danger me-4 material-button" data-bs-toggle="modal" data-bs-target="#product-material"
            aria-haspopup="true" aria-expanded="false" data-bs-reference="parent" data-id="${copData[i]._id}"><span
            class="fa-solid fa-trash-can me-2"></span>Delete</button>
            </td>
        </tr>
        `
        $('#product-cop-list').empty()
        $('#product-cop-list').append(copString)
    }
}