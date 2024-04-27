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
        setCustomer(response.data)
    },
    error: function(xhr, status, error) {
        // playSound(false)
        window.location = '/customer'
    },
    complete: function() {
        
    }
    });

    await $.ajax({
    url: `api/product/order-list?customer_id=${customerId}`,
    type: "GET",
    contentType: "application/json", // Replace with your data
    success: function(response) {
        if(response.status == false){
            window.location = '/customer'
        }
        setOrderList(response.data)
        // console.log(response.data,'Order List')
    },
    error: function(xhr, status, error) {
        // playSound(false)
        // window.location = '/customer'
        console.log(error)
    },
    complete: function() {
        
    }
    });
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


function setOrderList(OrderList) {
    var customerListString = ''
    for(let i=0;i<OrderList.length;i++){
        // {
        //     "_id": "662cb08b58b7ea8564212535",
        //     "order_no": 57,
        //     "order_name": "0.39513977580852067",
        //     "delivery_date": null,
        //     "driver_name": null,
        //     "customer_id": "65d1d3473df68937116f7b2e",
        //     "approved_by": null,
        //     "timestamp": "2024-04-27T08:00:11.773Z",
        //     "__v": 0,
        //     "product_count": 1,
        //     "user_name": "Dhaval Dubariya"
        // }
        var orderId = OrderList[i]._id
        var customerId = OrderList[i].customer_id
        var orderNumber = OrderList[i].order_no
        var orderName = OrderList[i].order_name
        var orderId = OrderList[i]._id
        var createdAt = OrderList[i].timestamp
        var createdBy = OrderList[i].user_name 
        var productCount = OrderList[i].product_count
        customerListString = customerListString +  `

        <tr class="hover-actions-trigger btn-reveal-trigger position-static">
        <td class="name align-middle white-space-nowrap ps-0">
          <div class="d-flex align-items-center">
            <a href="/order-detail?customerId=${customerId}&orderId=${orderId}">
            <div class="avatar avatar-xl me-3 ">
            <div class="avatar-name rounded-circle"><span>#</span></div>
          </div>   
            </a>
            <div><a class="fs-8 fw-bold" href="#!">   ${orderNumber}</a>
            <!-- <div class="d-flex align-items-center">
                <p class="mb-0 text-body-highlight fw-semibold fs-9 me-2">VP Accounting</p><span
                  class="badge badge-phoenix badge-phoenix-primary">Pending</span>
              </div>-->
            </div>
          </div>
        </td>
        <td class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight"><a
            class="text-body-highlight" style="font-size: 18px; text-align: center !important ; padding: 0 25px;" >${productCount}</a>
        </td>
        <td class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight"><a
          class="text-body-highlight" style="font-size: 18px; text-align: center !important ; padding: 0 25px;">${createdBy}</a>
        </td>
        <td
          class="company align-middle white-space-nowrap text-body-tertiary text-opacity-85 ps-4 border-end border-translucent fw-semibold text-body-highlight">
          <b>${createdAt}</b>
        </td>
      </tr>

        `
        // console.log(customerList)
    }
    $('#order-list').empty()
    $('#order-list').append(customerListString)
    
}