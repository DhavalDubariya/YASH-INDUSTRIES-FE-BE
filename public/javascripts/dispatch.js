$(document).ready(function(){
    $.ajax({
        url: `api/product/dispatch-order`,
        type: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success: function(response) {
            console.log(response)
            if(response.status == true){
                setDispatch(response.data)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
            
        },
        complete: function() {
            
        }
        });
})

function setDispatch(copData) {
    $('#product-count').text(`${copData.length} Product`)
    var copString = ``
    for(let i=0;i<copData.length;i++){
        copString = copString + 
        `
        <tr class="hover-actions-trigger btn-reveal-trigger position-static">
            <td class="align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent">${copData[i].customer_name}</td>
            <td class="align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent"># ${copData[i].order_no}</td>
            <td class="align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold text-body-highlight">${(moment(copData[i].iDate).format('DD MMM YYYY'))}</td>
            <td class="company align-middle white-space-nowrap text-body-tertiary text-opacity-85 ps-4 border-end border-translucent fw-semibold text-body-highlight">
            <a target="_blank" href="/print-dispatch?dispatchId=${copData[i]._id}" class="btn btn-phoenix-success me-4 material-button" data-id="${copData[i]._id}">PRINT</a>
            <a target="_blank" onclick="deletePrint('${copData[i]._id}')" class="btn btn-phoenix-danger me-4 material-button">DELETE</a>

            </td>
        </tr>
        `
    }
    $('#product-cop-list').empty()
    $('#product-cop-list').append(copString)
}


function deletePrint(x) {
    $.ajax({
    url: `api/product/dispatch-order?dispatchId=${x}`,
    type: "DELETE",
    contentType: "application/json",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem("yi-ssid")
    }, // Replace with your data
    success: function(response) {
        console.log(response)
        if(response.status == true){
            window.location = "/dispatch"
        }
    },
    error: function(xhr, status, error) {
        // playSound(false)
        
    },
    complete: function() {
        
    }
    });
}