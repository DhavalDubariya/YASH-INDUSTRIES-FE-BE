$(document).ready(async function () { 
    await $.ajax({
    url: `api/product/order-dispatch`,
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
        console.log(response.data)
        setOrderDetail(response.data)
    },
    error: function(xhr, status, error) {
        // playSound(false)
        window.location = '/customer'
    },
    complete: function() {
        
    }
    })
})

function setOrderDetail(data) { 
    var customerList = ''
    for(let i=0;i<data.length;i++){
        var customerName = data[i].customer_detail.customer_name
        var companyName = data[i].customer_detail.company_name == null ? '' : data[i].customer_detail.company_name
        var orderNo = data[i].order_no
        var productCount = data[i].product_count
        
        var orderId = data[i]._id 
        var customerId = data[i].customer_detail._id

        customerList = customerList +  `
        <tr class="hover-actions-trigger btn-reveal-trigger position-static">
        <td class="name align-middle white-space-nowrap ps-0">
            <div class="d-flex align-items-center">
            <a href="/order-detail?customerId=${customerId}&orderId=${orderId}">
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
        <td class="phone align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent" style="text-align: center;font-size:25px;"><a
            class="text-body-highlight" href="">#${orderNo}</a></td>
        <td
            class="contact align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight" style="text-align: center;font-size:25px;">
            ${productCount}
            </td>
        <td
            class="company align-middle white-space-nowrap text-body-tertiary text-opacity-85 ps-4 border-end border-translucent fw-semibold text-body-highlight">
                <a  href="/order-detail?customerId=${customerId}&orderId=${orderId}" class="btn btn-phoenix-success me-4 material-button">
                    DISPATCH
                </a>
            </td>
        </tr>
        `
        // console.log(customerList)
    }
    $('#leal-tables-body').empty()
    $('#leal-tables-body').append(customerList)
}