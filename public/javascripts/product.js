$(document).ready(async function() {
    var searchParams = new URLSearchParams(window.location.search);
    if(Array.from(searchParams).filter( x => x[0] == "customerId" && x[1] != "" ).length == 0){
        window.location = '/customer'
    }
    var customerId = Array.from(searchParams).filter( x => x[0] == "customerId")[0][1]
    await $.ajax({
    url: `api/customer/customer-detail?customerId=${customerId}`,
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
    var data = [
        {
            "name": "product_name",
            "value": "asdsad"
        },
        {
            "name": "product_quantity",
            "value": "1"
        },
        {
            "name": "runner",
            "value": "1"
        },
        {
            "name": "material_name",
            "value": "1"
        },
        {
            "name": "material_color",
            "value": "1"
        },
        {
            "name": "material_qty",
            "value": "1"
        },
        {
            "name": "material_name",
            "value": "1"
        },
        {
            "name": "material_color",
            "value": "1"
        },
        {
            "name": "material_qty",
            "value": "1"
        }
    ]
    
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
    forMateForm["customer_id"] = customerId
    forMateForm["material"] = materialArray
    console.log(forMateForm)
    $.ajax({
        type: "POST",
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