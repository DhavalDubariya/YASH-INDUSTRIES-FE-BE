$(document).ready(function(){
    $('#datepicker').val((moment(new Date()).format()).split('T')[0])
    console.log((moment(new Date()).format()).split('T')[0])
    getCustomerOrderProduct((moment(new Date()).format()).split('T')[0])

})

$('#datepicker').change(function(){
    var date = $('#datepicker').val()
    console.log(date)
})


function getCustomerOrderProduct(date) {
    $.ajax({
        url: `api/product/genric-machine?iDate=2024-03-01`,
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