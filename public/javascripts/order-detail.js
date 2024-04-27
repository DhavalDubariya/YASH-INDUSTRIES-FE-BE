var customerDetail
var globalData
$(document).ready(async function() {
    var searchParams = new URLSearchParams(window.location.search);
    console.log(Array.from(searchParams),'::::::::::::::::::::::::::::::::::')
    var queryParams = Array.from(searchParams).map( x => { return `${x[0]}=${x[1]}`})
    await $.ajax({
    url: `api/product/order-detail?${queryParams.join('&')}`,
    type: "GET",
    contentType: "application/json", // Replace with your data
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

        <tr class="hover-actions-trigger btn-reveal-trigger position-static">
        <td class="name align-middle white-space-nowrap ps-0">
          <div class="d-flex align-items-center" style="padding-left:20px" >
            <div><b class="fs-8 fw-bold">${productName}</b>
            </div>
          </div>
        </td>
        <td class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight"><a
            class="text-body-highlight" style="font-size: 18px; text-align: center !important ; padding: 0 25px;" >${productQty}</a>
        </td>
        <td class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight"><a
          class="text-body-highlight" style="font-size: 18px; text-align: center !important ; padding: 0 25px;">${runner}</a>
        </td>
        <td
          class="company align-middle white-space-nowrap text-body-tertiary text-opacity-85 ps-4 border-end border-translucent fw-semibold text-body-highlight">
          <b>
          <button class="btn btn-phoenix-primary me-4 material-button" data-bs-toggle="modal" data-bs-target="#product-material"
          aria-haspopup="true" aria-expanded="false" data-bs-reference="parent" data-id="${productId}"><span
            class="fas fa-eye me-2"></span>View</button>

            <a class="btn btn-phoenix-success me-4" href="/product?customerId=${customerId}&productId=${productId}" data-id="${productId}"><span
            class="fas fa-key me-2"></span>Edit</a>

            <button class="btn btn-phoenix-danger me-4 material-button" data-bs-toggle="modal" data-bs-target="#product-material"
            aria-haspopup="true" aria-expanded="false" data-bs-reference="parent" data-id="${productId}"><span
            class="fa-solid fa-trash-can me-2"></span>Delete</button>
          </b>
        </td>
      </tr>

        `
        // console.log(customerList)
    }
    $('#product-list').empty()
    $('#product-list').append(productListString)
}