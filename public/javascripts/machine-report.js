var timeData = []
var worker = []
$(document).ready(function () {
    $('#datepicker').val((moment(new Date()).format()).split('T')[0])
    console.log((moment(new Date()).format()).split('T')[0])
    getCustomerOrderProduct((moment(new Date()).format()).split('T')[0])
    getMachine()
    $.ajax({
        url: `api/product/machine-time`,
        type: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success: function(response) {
            if(response.status == true){
                console.log(response, 'Dhaval')
                timeData = response.data
                worker = response.worker
                getDailyTime()
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
    var date = $('#datepicker').val()
    console.log(date)
    getCustomerOrderProduct(date)
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

function getDailyTime() {
    var dayNightSwitch = $('#flexSwitchCheckDefault').attr('data-id') 
    var daySwitch = dayNightSwitch == "true" ? true : false
    var timeDataFilter = timeData.filter(x => x.flag_day_shift == daySwitch).sort((a, b) => { return a.seq_no - b.seq_no })
    var workerString = `<option data-id="null">SELECT WORKER</option>`
    for (let i = 0; i < worker.length;i++) { 
        workerString = workerString + 
            `
                <option class="worker-option" data-id="${worker[i]._id}">${worker[i].worker_name}</option>
            `
    }
    var timeString = ``
    for (let i = 0; i < timeDataFilter.length;i++){ 
        timeString = timeString + `
        <tr style="padding: 0px !important;" data-id="${timeDataFilter[i]._id}">
        <td style="padding: 0px !important; font-size: 24px; text-align: center;">
            <b>${timeDataFilter[i].machine_time}</b>
        </td>
        <td style="padding: 0px !important;">
            <input data-id="${timeDataFilter[i]._id}" style="border-radius: 0px !important;" class="form-control input-count" pattern="^[1-9]\d*$" type="number" name="material_qty" id="material_qty" placeholder="Quantity" />
        </td>
        <td style="padding: 0px !important;">
            <select data-id="${timeDataFilter[i]._id}" class="form-select input-worker" style="text-transform: uppercase; border-radius: 0px;">
                ${workerString}
            </select>
        </td>
        <td style="padding: 0px !important;">
            <input data-id="${timeDataFilter[i]._id}" style="border-radius: 0px !important;" class="form-control input-reason" type="text" name="reason"  placeholder="REASON" />
        </td>
        </tr>
        `
    }
    $('#product-cop-list').empty()
    $('#product-cop-list').append(timeString)
}

$('#flexSwitchCheckDefault').change(function (e) { 
    var daySwitch = $('#flexSwitchCheckDefault').attr('data-id')
    daySwitch = daySwitch == "true" ? $('#flexSwitchCheckDefault').attr('data-id',false) : $('#flexSwitchCheckDefault').attr('data-id',true)
    getDailyTime()
})

$('#datepicker,#customer-order-product,#select-machine,#flexSwitchCheckDefault').change(function (e) { 
    getMachineData()
})

$(document).on('change', '.input-count,.input-worker,.input-reason', function(e) {
    // Your event handling code here
    var dataId = $(this).attr('data-id')
    var machine_count = $('#product-cop-list').find(`.input-count[data-id=${dataId}]`).val()
    var worker_id = $('#product-cop-list').find(`.input-worker[data-id=${dataId}]`).find('option:selected').attr('data-id')
    var reason = $('#product-cop-list').find(`.input-reason[data-id=${dataId}]`).val()
    var iDate = $('#datepicker').val()
    var daily_product_id = $('#customer-order-product').find('option:selected').attr('id')
    var machine_id = $('#select-machine').find('option:selected').attr('id')
    var flag_day_shift = $('#flexSwitchCheckDefault').attr('data-id') == "true" ? true : false
    console.log(
    {iDate,
    daily_product_id,
    machine_id,
    flag_day_shift,
    machine_time_id:dataId,
    machine_count,
    worker_id,
    reason}
    )

    $.ajax({
        type: "POST",
        url: "api/product/machine-report",
        data: JSON.stringify({iDate,
            daily_product_id,
            machine_id,
            flag_day_shift,
            machine_time_id:dataId,
            machine_count,
            worker_id,
            reason}),
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        },
        success: function(response){
            // Handle success
            console.log("Request successful");
            console.log(response);
            if(response.status == true){
                console.log(response)   
            }
        },
        error: function(xhr, status, error){
            // Handle errors
            console.log("Request failed");
            console.log(xhr.responseText);
        }
    });
});

function getMachineData () {
    var iDate = $('#datepicker').val()
    var daily_product_id = $('#customer-order-product').find('option:selected').attr('id')
    var machine_id = $('#select-machine').find('option:selected').attr('id')
    var flag_day_shift = $('#flexSwitchCheckDefault').attr('data-id') == "true" ? true : false
    $.ajax({
        url: `api/product/machine-data`,
        type: "POST",
        data: JSON.stringify({iDate,
        daily_product_id,
        machine_id,
        flag_day_shift}),
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success: function(response) {
            if(response.status == true){
                console.log(response, 'Dhaval')
                // timeData = response.data
                // worker = response.worker
                getDailyTimeData(response.data)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            
        }
    });
}

function getDailyTimeData(macineTimeData) {
    var dayNightSwitch = $('#flexSwitchCheckDefault').attr('data-id') 
    var daySwitch = dayNightSwitch == "true" ? true : false
    var timeDataFilter = macineTimeData.filter(x => x.flag_day_shift == daySwitch).sort((a, b) => { return a.seq_no - b.seq_no })
    var workerString = `<option data-id="null">SELECT WORKER</option>`
    for (let i = 0; i < worker.length;i++) { 
        workerString = workerString + 
            `
                <option class="worker-option" data-id="${worker[i]._id}">${worker[i].worker_name}</option>
            `
    }
    var timeString = ``
    for (let i = 0; i < timeDataFilter.length;i++){ 
        timeDataFilter[i].reason == null ? '' : timeDataFilter[i].reason
        timeString = timeString + `
        <tr style="padding: 0px !important;" data-id="${timeDataFilter[i]._id}">
        <td style="padding: 0px !important; font-size: 24px; text-align: center;">
            <b>${timeDataFilter[i].machine_time}</b>
        </td>
        <td style="padding: 0px !important;">
            <input data-id="${timeDataFilter[i]._id}" value="${timeDataFilter[i].machine_count}" style="border-radius: 0px !important;" class="form-control input-count" pattern="^[1-9]\d*$" type="number" name="material_qty" id="material_qty" placeholder="Quantity" />
        </td>
        <td style="padding: 0px !important;">
            <select data-id="${timeDataFilter[i]._id}" class="form-select input-worker" style="text-transform: uppercase; border-radius: 0px;">
                ${workerString}
            </select>
        </td>
        <td style="padding: 0px !important;">
            <input data-id="${timeDataFilter[i]._id}" value="${timeDataFilter[i].reason}" style="border-radius: 0px !important;" class="form-control input-reason" type="text" name="reason"  placeholder="REASON" />
        </td>
        </tr>
        `
    }
    $('#product-cop-list').empty()
    $('#product-cop-list').append(timeString)
}