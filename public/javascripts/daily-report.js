$(document).ready(function(){
    var date = moment(new Date()).format("MMM Do YYYY");
    $('#datepicker').val(date)

    $.ajax({
    url: `api/product/customer-order`,
    type: "GET",
    contentType: "application/json",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem("yi-ssid")
    }, // Replace with your data
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

$('#datepicker').change(function(){
    var date = moment($('#datepicker').val()).format("MMM Do YYYY");
    $('#datepicker').val(date)
})