var customeOrderProduct
$(document).ready(async function(){
    $('#datepicker').val((moment(new Date()).format()).split('T')[0])
    // $('body').append(`<h1>Hello</h1>`)
    await getCustomerOrderProduct((moment(new Date()).format()).split('T')[0])
    // console.log(tableDate)
    // $('body').append(`${tableDate}`)
    // $('#daily-machine-report-html').empty()

    $('#close-button').click(function () {
        console.log('::::::::::::::')
        resetCOP()
    })   
})

$('#datepicker').change(async function(){
    var date = $('#datepicker').val()
    console.log(date)
    await getCustomerOrderProduct(date)
})


async function getCustomerOrderProduct(date) {
    if(window.location.href.includes('daily-machine-print') == true){
        date = window.location.href.split('iDate=')[1]
    }
    $.ajax({
        url: `api/product/daily-machine-report?iDate=${date}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("yi-ssid")
        }, // Replace with your data
        success:  function(response) {

                console.log(response,'::::::::::::::::::::::::::::::::')
                $('#daily-machine-dhaval').empty() 
                $('#daily-machine-dhaval').append(`${response}`)
                // $('body').append(`${tableDate}`)
            
        },
        error: function(xhr, status, error) {
            // playSound(false)
        },
        complete: function() {
            
        }
        });
}


// async function setDayliProductReport(data) {
//   var tableData = $('#daily-machine-report-html').html().replaceAll(`\n`,'')
//   // console.log(tableData)
//   for(let i=0;i<data.length;i++){
//     // console.log(data[i].machine_name,'::::::::::::::::::')
//     tableData = tableData.replaceAll('{{machineName}}',data[i].machine_name)
//     for(let j=0;j<data[i].daily_product.length;j++){
//       machinCount = ``
//       machinWorker = ``
//       machineReason = ``
//       tableData = tableData.replaceAll('{{productName}}',data[i].daily_product[j].product_name)
//       var machineTime = data[i].daily_product[j].machine_time.filter( x => x.flag_day_shift == true )
//       for(let k=0;k<machineTime.length;k++){
//         // console.log(machineTime[k].machine_time.length)
//         machinCount = machinCount + `
//           <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
//             ${machineTime[k].machine_report.length == 0 ? '' : machineTime[k].machine_report[0].machine_count}
//           </td>
//         `
//         machinWorker = machinWorker + `
//           <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
//             ${machineTime[k].machine_report.length == 0 ? '' : machineTime[k].machine_report[0].worker_name == null ? '' : machineTime[k].machine_report[0].worker_name}
//           </td>
//         `
//         machineReason = machineReason + `
//           <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
//             ${machineTime[k].machine_report.length == 0 ? '' : (machineTime[k].machine_report[0].reason == (null || ''))  ? '' : machineTime[k].machine_report[0].reason}
//           </td>
//         `
//       }
//       tableData = tableData.replaceAll('{{machinCount}}',machinCount)
//       tableData = tableData.replaceAll('{{machinWorker}}',machinWorker)
//       tableData = tableData.replaceAll('{{machineReason}}',machineReason)
//       var machineNightCount = ``
//       var machinNightWorker = ``
//       var machinNightReason = ``
//       var machineNightTime = data[i].daily_product[j].machine_time.filter( x => x.flag_day_shift == false)
//       for(let k=0;k<machineNightTime.length;k++){
//         // console.log(machineNightTime[k].machine_time.length)
//         machineNightCount = machineNightCount + `
//           <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
//             ${machineNightTime[k].machine_report.length == 0 ? '' : machineNightTime[k].machine_report[0].machine_count}
//           </td>
//         `
//         machinNightWorker = machinNightWorker + `
//           <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
//             ${machineNightTime[k].machine_report.length == 0 ? '' : machineNightTime[k].machine_report[0].worker_name == null ? '' : machineNightTime[k].machine_report[0].worker_name}
//           </td>
//         `
//         machinNightReason = machinNightReason + `
//           <td  class="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent">
//             ${machineNightTime[k].machine_report.length == 0 ? '' : (machineNightTime[k].machine_report[0].reason == (null || ''))  ? '' : machineNightTime[k].machine_report[0].reason}
//           </td>
//         `
//       }
      
//       tableData = tableData.replaceAll('{{machineNightCount}}',machineNightCount)
//       tableData = tableData.replaceAll('{{machineNightWorker}}',machinNightWorker)
//       tableData = tableData.replaceAll('{{machineNightReason}}',machinNightReason)
//     }
    
//   }
//   // return tableData
//   $('#daily-machine-dhaval').append(`${tableData}`)
  
// }