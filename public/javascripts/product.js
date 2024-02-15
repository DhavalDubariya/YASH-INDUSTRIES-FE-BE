$("#add-material").on("click",function(event){
    event.preventDefault()
    
    var date = new Date().getTime()
    var materialHtml = `
    <tr style="padding: 0px !important;" material-data-id="${date}">
        <td style="padding: 0px !important;">
        <input style="border-radius: 0px !important;" class="form-control" type="text" name="material_name" id="material_name" placeholder="Name"
            required />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please provide material name.</div>
        </td>
        <td style="padding: 0px !important;">
        <input style="border-radius: 0px !important;" class="form-control" type="text" name="material_color" id="material_color" placeholder="Color"
            required />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please provide color.</div>
        </td style="padding: 0px !important;">
        <td style="padding: 0px !important;"><input style="border-radius: 0px !important;" class="form-control" type="number" pattern="^[1-9]\d*$" name="material_qty" id="material_qty" placeholder="Quantity"
        required />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please provide quantity.</div></td>
        <td style="padding: 0.325rem; cursor: pointer;" onclick="removeMaterial(${date})">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus-circle text-danger" style="height: 18px; width: 18px;"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        </div>
        </td>
    </tr>
    `
    playSound(true)
    $("#material").append(materialHtml)
})


function removeMaterial(materialDataId) {
    if($('#material').find('tr').length == 1){
        console.log('Cannot Remove Last Row')
        return
    }
    playSound(false)
    $(`[material-data-id="${materialDataId}"]`).remove()
    
}