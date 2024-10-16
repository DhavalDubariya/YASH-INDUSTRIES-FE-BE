var timeData = []
var worker = []
$(document).ready(async function () {
    showLoader(true)
    $('#datepicker').val((moment(new Date()).format()).split('T')[0])
    console.log((moment(new Date()).format()).split('T')[0])
    
    await Promise.all([
        await getCustomerOrderProduct((moment(new Date()).format()).split('T')[0]),
        await getMachine(),
        await getMachinGeneric()
    ])
    setTimeout(function (){
        getMachineData()
        hideLoader()
    },2000)
})

$('#datepicker').change(function(){
    var date = $('#datepicker').val()
    console.log(date)
    getCustomerOrderProduct(date)
})

var machineData
async function getMachine() {
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


async function getCustomerOrderProduct(date) {
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
    machineData = response
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

function getDailyTime(flagLoadData) {
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
                showTost(true)
                var machineCount = 0 
                var machineCountSum = Array.from($('.input-count')).map( x => {if(isNaN(parseInt(x.value)) == false){
                    machineCount = machineCount + parseInt(x.value)
                }})
                $('#machine-count-sum').text(machineCount)
            }
            if(response.status == false){
                console.log(response)   
                showTost(false)
            }
        },
        error: function(xhr, status, error){
            // Handle errors
            showTost(false)
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
                getDailyTimeData(response.data,response.rejection,response.unit_count)
            }
            if(response.status == false){
                showTost(false)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
            showTost(false)

        },
        complete: function() {
            
        }
    });
}

function getDailyTimeData(macineTimeData,rejection,unitCount) {
    console.log(macineTimeData,'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT')
    var dayNightSwitch = $('#flexSwitchCheckDefault').attr('data-id') 
    var daySwitch = dayNightSwitch == "true" ? true : false
    var timeDataFilter = macineTimeData.filter(x => x.flag_day_shift == daySwitch).sort((a, b) => { return a.seq_no - b.seq_no })
    var timeString = ``
    var machineCount = 0
    for (let i = 0; i < timeDataFilter.length;i++){ 
        workerString = ''
        var workerString = `<option data-id="null">SELECT WORKER</option>`
        for (let j = 0; j < worker.length;j++) { 
            if(worker[j]._id == timeDataFilter[i].worker_id){
                console.log(worker[j]._id == timeDataFilter[i].worker_id,worker[j]._id,timeDataFilter[i].worker_id)
                workerString = workerString + `
                <option class="worker-option" data-id="${worker[j]._id}" selected>${worker[j].worker_name}</option>
                `
            }else{
                workerString = workerString + `
                <option class="worker-option" data-id="${worker[j]._id}">${worker[j].worker_name}</option>
                `
            }
                
        }
        timeDataFilter[i].reason = timeDataFilter[i].reason == null || '' || undefined ? '' : timeDataFilter[i].reason
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
        machineCount = machineCount + timeDataFilter[i].machine_count
        // console.log('Dhaval',machineCount)
    }
    
    timeString = timeString +  `
        <tr style="padding: 0px !important;">
        <td style="text-align:center;font-size: 25px;">
            <b>Total</b>
        </td>
        <td style="text-align:center;font-size: 25px;" > 
            <b id="machine-count-sum" >${machineCount}</b>
        </td>
        <td style="padding: 0px !important;">
            
        </td>
        <td style="padding: 0px !important;">
            
        </td>
        </tr>
    `
    console.log('value change :::::::::::::::::::::::::::')
    var rejectionCount = rejection.filter( x => x.flag_day_shift == daySwitch )
    rejectionCount = rejectionCount.length == 0 ? 0 : rejectionCount[0].rejection_count
    var machine_id = $('#select-machine').find('option:selected').attr('id')
    var unitCount = unitCount.filter( x => x.machine_id == machine_id)
    unitCount = unitCount.length == 0 ? 0 : unitCount[0].unit_count
    $('#rejection-count').val(rejectionCount)
    $('#unit-count').val(unitCount)
    // console.log(macineTimeData,']]]]]]]]]]]]]]]]]]]]]]]]]]',rejectionCount)
    $('#product-cop-list').empty()
    $('#product-cop-list').append(timeString)
}

async function getMachinGeneric() {
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
                getDailyTime(true)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            
        }
    });
}

$('#rejection-count').change(function(e) {
    rejectionCount()
})

function rejectionCount () {
    var iDate = $('#datepicker').val()
    var daily_product_id = $('#customer-order-product').find('option:selected').attr('id')
    var machine_id = $('#select-machine').find('option:selected').attr('id')
    var flag_day_shift = $('#flexSwitchCheckDefault').attr('data-id') == "true" ? true : false
    var rejection_count = $('#rejection-count').val()
    console.log(iDate,daily_product_id,machine_id,flag_day_shift,rejection_count)

    $.ajax({
        type: "POST",
        url: "api/product/rejection-count",
        data: JSON.stringify({iDate,
            daily_product_id,
            machine_id,
            flag_day_shift,
            rejection_count,
        }),
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
                showTost(true)
            }
            if(response.status == false){
                console.log(response)   
                showTost(false)
            }
        },
        error: function(xhr, status, error){
            // Handle errors
            showTost(false)
            console.log("Request failed");
            console.log(xhr.responseText);
        }
    });
}

$('#unit-count').change(function(e){
    var iDate =  $('#datepicker').val()
    var unitCount =  $('#unit-count').val()
    var machineId = $('#select-machine').find('option:selected').attr('id')
    $.ajax({
        url: `api/product/unit`,
        type: "POST",
        data: JSON.stringify({"iDate":iDate,"unit_count":unitCount,"machine_id":machineId}),
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
            }
            if(response.status == false){   
                showTost(false)
            }
        },
        error: function(xhr, status, error) {
            // playSound(false)
            showTost(false)

        },
        complete: function() {
            
        }
    });
})