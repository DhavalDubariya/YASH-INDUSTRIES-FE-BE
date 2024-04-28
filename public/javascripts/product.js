$(document).ready(async function() {
    var searchParams = new URLSearchParams(window.location.search);
    if(Array.from(searchParams).filter( x => x[0] == "customerId" && x[1] != "" ).length == 0){
        window.location = '/customer'
    }
    var customerId = Array.from(searchParams).filter( x => x[0] == "customerId")[0][1]
    var productId = Array.from(searchParams).filter( x => x[0] == "productId")[0][1]
    await $.ajax({
    url: `api/customer/customer-detail?customerId=${customerId}&productId=${productId}`,
    type: "GET",
    contentType: "application/json", // Replace with your data
    success: function(response) {
        if(response.status == false){
            window.location = '/customer'
        }
        customerDetail = response.data
    },
    error: function(xhr, status, error) {
        // playSound(false)
        window.location = '/customer'
    },
    complete: function() {
        
    }
    });

    await $.ajax({
        url: `api/product/product-detail?productId=${productId}`,
        type: "GET",
        contentType: "application/json", // Replace with your data
        success: function(response) {
            if(response.status == true){
                console.log('Product Detail')
                setUpdateProduct(response.data)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            
        }
        });
})

$("#add-material").on("click",function(event){
    event.preventDefault()
    
    var date = new Date().getTime()
    var materialHtml = `
    
    <tr style="padding: 0px !important;" material-data-id="${date}">
    <form id="${date}_material" class="needs-validation" novalidate="">
        <td style="padding: 0px !important;">
        <input style="border-radius: 0px !important;" class="form-control" type="text" name="material_name" id="material_name" placeholder="Name"
            required />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please provide material name.</div>
        </td>
        <td style="padding: 0px !important;">
        <input style="border-radius: 0px !important;" class="form-control" type="text" name="material_color" id="material_color" placeholder="Color"
            required />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please provide color.</div>
        </td style="padding: 0px !important;">
        <td style="padding: 0px !important;"><input style="border-radius: 0px !important;" class="form-control" type="number" pattern="^[1-9]\d*$" name="material_qty" id="material_qty" placeholder="Quantity"
        required />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please provide quantity.</div></td>
        <td style="padding: 0.325rem; cursor: pointer;" onclick="removeMaterial(${date})">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus-circle text-danger" style="height: 18px; width: 18px;"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        </div>
        </td>
    </form>
    </tr>
    `
    playSound(true)
    $("#material").append(materialHtml)
})


function removeMaterial(materialDataId) {
    console.log(materialDataId,':::::::::::::::::::::::::::::::')
    if($('#material').find('tr').length == 1){
        console.log('Cannot Remove Last Row')
        return
    }
    playSound(false)
    $(`[material-data-id="${materialDataId}"]`).remove()
}

$('#customer-product').on('click',async function(e){
    e.preventDefault()
    var productForm = $('#product-form')
    var validateForm = productForm[0].checkValidity()
    console.log(validateForm)
    if(validateForm == false){
        return
    }
    var materialForm = Array.from($('#material').find('form')).map( x => x.id )
    var materialFormData = []
    // for(let i=0;i<materialForm.length;i++){
    //     console.log($(`#${materialForm[i]}`).serializeArray(),'::::::::::::',materialForm[i])
    //     materialFormData.push($(`#${materialForm[i]}`).serializeArray())
    // }
    var form = productForm.serializeArray()
    var forMateForm = keyValueObject(form)
    // console.log(form)
    var materialArray = []
    for(let i=0;i<form.length;i++){
        if(form[i].name == "material_name"){
            materialArray.push({
                "material_name":form[i].value,
                "material_color":form[i+1].value,
                "material_qty":form[i+2].value
            })
            i = i + 2
        }
    }
    var searchParams = new URLSearchParams(window.location.search);
    var customerId = Array.from(searchParams).filter( x => x[0] == "customerId")[0][1]
    var productId = Array.from(searchParams).filter( x => x[0] == "productId").length == 0 ? undefined : Array.from(searchParams).filter( x => x[0] == "productId")[0][1]
    var orderId = Array.from(searchParams).filter( x => x[0] == "orderId").length == 0 ? undefined : Array.from(searchParams).filter( x => x[0] == "orderId")[0][1]
    forMateForm["customer_id"] = customerId
    forMateForm["product_id"] = productId
    forMateForm["order_id"] = orderId
    forMateForm["material"] = materialArray
    console.log(forMateForm)
    var type = 'POST'
    if($('#customer-product').attr('flag-create') == "true"){
        type = 'POST'
    }else{
        type = 'PUT'
    }
    $.ajax({
        type: type,
        url: "api/product/product",
        data: JSON.stringify(forMateForm),
        contentType: "application/json",
        success: function(response){
            // Handle success
            console.log("Request successful");
            console.log(response);
        },
        error: function(xhr, status, error){
            // Handle errors
            console.log("Request failed");
            console.log(xhr.responseText);
        }
    });
})

function setUpdateProduct(productData) {
    $('#product_name').val(productData.product_name)
    $('#product_quantity').val(productData.product_qty)
    $('#runner').val(productData.runner)
    $('#product-page').text('Update Product')
    $('#customer-product').text('Update')
    $('#customer-product').attr('flag-create',"false")
    var date = new Date().getTime()
    var materialHtml = ``
    for(let i=0;i<productData.material.length;i++){
        var ramdumNumbar = date + parseInt(Math.random()*1000)
        materialHtml = materialHtml + `
        <tr style="padding: 0px !important;" material-data-id="${ramdumNumbar}">
        <form id="${ramdumNumbar}_material" class="needs-validation" novalidate="">
            <td style="padding: 0px !important;">
            <input style="border-radius: 0px !important;" class="form-control" type="text" name="material_name" id="material_name" placeholder="Name" value="${productData.material[i].material_name}"
                required />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please provide material name.</div>
            </td>
            <td style="padding: 0px !important;">
            <input style="border-radius: 0px !important;" class="form-control" type="text" name="material_color" id="material_color" placeholder="Color" value="${productData.material[i].material_color}"
                required />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please provide color.</div>
            </td style="padding: 0px !important;">
            <td style="padding: 0px !important;"><input style="border-radius: 0px !important;" class="form-control" type="number" pattern="^[1-9]\d*$" name="material_qty" id="material_qty" placeholder="Quantity" value="${productData.material[i].material_qty}"
            required />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please provide quantity.</div></td>
            <td style="padding: 0.325rem; cursor: pointer;" onclick="removeMaterial(${ramdumNumbar})">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus-circle text-danger" style="height: 18px; width: 18px;"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            </td>
        </form>
        </tr>
        `
    }

    // playSound(true)
    $("#material").empty()
    $("#material").append(materialHtml)
}