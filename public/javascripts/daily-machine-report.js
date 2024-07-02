var customeOrderProduct
$(document).ready(function(){
    $('#datepicker').val((moment(new Date()).format()).split('T')[0])
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


function getCustomerOrderProduct(date) {
    $.ajax({
        url: `api/product/daily-machine-report?iDate=${date}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success: function(response) {
            if(response.status == true){
                console.log(response)
                // setCustomeOrderProduct(response.data)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            
        }
        });
}
