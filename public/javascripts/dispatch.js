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
        },
        error: function(xhr, status, error) {
            // playSound(false)
            
        },
        complete: function() {
            
        }
        });
})