$(document).ready(function() {
    $('#customer-popup').on('submit', function(e) {
        e.preventDefault()
        var customerPopup = $('#customer-popup')
        var validateForm = customerPopup[0].checkValidity()
        if(validateForm == false){
            return
        }
        var searchParams = new URLSearchParams(window.location.search);
        var form = customerPopup.serializeArray()
        console.log(form)
        if(window.location.href.includes('customer-detail') == false){
            $.ajax({
            url: "api/customer/customer",
            type: "POST",
            contentType: "application/json",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("yi-ssid")
            },
            data: JSON.stringify(keyValueObject(form)), // Replace with your data
            success: function(response) {
                console.log(response)
                if(response.status == false){
                    
                }
                setCustomerDetail(response.data)
                playSound(true)
                $('#addDealModal').modal('toggle')
                $('#customer-popup').removeClass('was-validated');
                $('#customer-popup')[0].reset();
            },
            error: function(xhr, status, error) {
                
            },
            complete: function() {
                hideLoader()
            }
            });
        }

        if(window.location.href.includes('customer-detail') == true){
            var customerId = Array.from(searchParams).filter( x => x[0] == "customerId")[0][1]
            form = keyValueObject(form)
            form["customer_id"] = customerId
            $.ajax({
            url: "api/customer/customer",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("yi-ssid")
            }, // Replace with your data
            success: function(response) {
                console.log(response)
                if(response.status == false){
                    return
                }
                // setCustomerDetail(response.data)
                customerDetail = form
                setCustomer(form)
                playSound(true)
                $('#addDealModal').modal('toggle')
                $('#customer-popup').removeClass('was-validated');
                $('#customer-popup')[0].reset();
            },
            error: function(xhr, status, error) {
                playSound(false)
            },
            complete: function() {
                hideLoader()
            }
            });
        }
    });
    // showLoader()
    if(window.location.href.includes('customer-detail') == false){
    $.ajax({
        url: "api/customer/customer",
        type: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success: function(response) {
            setCustomerDetail(response.data)
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            hideLoader()
        }
        });
    }
});

$('#addDealModal [data-bs-dismiss="modal"]').on('click',function (e) {
    e.preventDefault();
    $('#customer-popup').removeClass('was-validated');
    $('#customer-popup')[0].reset();
})

$('#update-customer').on('click',function (e) {
    e.preventDefault();
    var customerModel = $('#addDealModal')
    $('#customer-display-name').text('Update Customer')
    $('#customer-display-button').text('Update')
    $('#customer_name').val(customerDetail.customer_name)
    $('#phone_number').val(customerDetail.phone_number)
    $('#company_name').val(customerDetail.company_name)
    $('#city').val(customerDetail.city)
    $('#address').val(customerDetail.address)
    customerModel.modal('toggle')
})

$('#creaet-product').on('click',function(e){
    e.preventDefault()
    var customerId = $('#customer-id').val()
    window.location = `/product?customerId=${customerId}`
})

function setCustomerDetail(customer) {
    var customerList = ''
    for(let i=0;i<customer.length;i++){
        var customerName = customer[i].customer_name
        var companyName = customer[i].company_name == null ? '' : customer[i].company_name
        var phoneNumber = customer[i].phone_number
        var city = customer[i].city == null ? '' : customer[i].city 
        var address = customer[i].address == null ? '' : customer[i].address
        var customerId = customer[i]._id 
        customerList = customerList +  `
        <tr class="hover-actions-trigger btn-reveal-trigger position-static">
        <td class="name align-middle white-space-nowrap ps-0">
            <div class="d-flex align-items-center">
            <a href="/customer-detail?customerId=${customerId}">
                <div class="avatar avatar-xl me-3 ">
                  <div class="avatar-name rounded-circle"><span>${customerName[0]}</span></div>
                </div>   
            </a>
            <div><a class="fs-8 fw-bold" href="#!">${customerName}</a>
                <div class="d-flex align-items-center">
                <p class="mb-0 text-body-highlight fw-semibold fs-9 me-2">${companyName}</p>
                </div>
            </div>
            </div>
        </td>
        <td class="phone align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent"><a
            class="text-body-highlight" href="tel:+91${phoneNumber}">${phoneNumber}</a></td>
        <td
            class="contact align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight">
            ${city}</td>
        <td
            class="company align-middle white-space-nowrap text-body-tertiary text-opacity-85 ps-4 border-end border-translucent fw-semibold text-body-highlight">
            ${addBrTag(address)}</td>
        </tr>
        `
        // console.log(customerList)
    }
    $('#leal-tables-body').empty()
    $('#leal-tables-body').append(customerList)
}
