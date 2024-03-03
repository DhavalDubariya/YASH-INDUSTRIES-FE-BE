var customerDetail
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
    setCustomer(customerDetail)
})

function setCustomer(customerDetail) {
    $('#customer-image').text(customerDetail.customer_name[0])
    $("#company-name").text(customerDetail.customer_name)
    $("#customer-name").text(customerDetail.company_name)
    $("#customer-phonenumber").text(customerDetail.phone_number)
    $("#customer-phonenumber").attr('href',`tel:+91${customerDetail.phone_number}`)
    $("#customer-address").text(customerDetail.address)
    $("#customer-city").text(customerDetail.city)
    $('#customer-id').val(customerDetail._id)
}