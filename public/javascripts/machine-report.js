$(document).ready(function(){
    $('#datepicker').val((moment(new Date()).format()).split('T')[0])
    console.log((moment(new Date()).format()).split('T')[0])
    getCustomerOrderProduct((moment(new Date()).format()).split('T')[0])
    getMachine()

})

$('#datepicker').change(function(){
    var date = $('#datepicker').val()
    console.log(date)
})


function getMachine() {
    $.ajax({
        url: `api/product/genric-machine`,
        type: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success: function(response) {
            if(response.status == true){
                console.log(response)
                setMachine(response.data)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            
        }
        });
}


function getCustomerOrderProduct(date) {
    $.ajax({
        url: `api/product/dayily-product?iDate=${date}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success: function(response) {
            if(response.status == true){
                console.log(response)
                setCustomeOrderProduct(response.data)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            
        }
        });
}

function setCustomeOrderProduct(copData) {
    var copString = ``
    for(let i=0;i<copData.length;i++){
        copString = copString + 
        `
            <option id='${copData[i]._id}' >${copData[i].customer_name} ${copData[i].order_number} ${copData[i].product_name}</option>
        `
    }
    $('#customer-order-product').empty()
    $('#customer-order-product').append(copString)
}

function setMachine(response) {
    var machineString = ``
    for(let i=0;i<response.length;i++){
        console.log(response[i],':::::::::::::')
        machineString = machineString + 
        `
            <option id='${response[i]._id}'>${response[i].machine_name}</option>
        `
    }
    $('#select-machine').empty()
    $('#select-machine').append(machineString)
}