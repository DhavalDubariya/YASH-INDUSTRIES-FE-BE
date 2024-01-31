$(document).ready(function() {
    $('#customer-popup').on('submit', function(e) {
        e.preventDefault()
        var customerPopup = $('#customer-popup')
        var validateForm = customerPopup[0].checkValidity()
        if(validateForm == false){
            playSound(false)
            return
        }
        var form = customerPopup.serializeArray()
        playSound(true)
        console.log(form)
    });
});

$('#addDealModal [data-bs-dismiss="modal"]').on('click',function (e) {
    e.preventDefault();
    $('#customer-popup').removeClass('was-validated');
    $('#customer-popup')[0].reset();
    playSound(false)
})

$('#update-customer').on('click',function (e) {
    e.preventDefault();
    var customerModel = $('#addDealModal')
    $('#customer-display-name').text('Update Customer')
    $('#customer-display-button').text('Update')
    customerModel.modal('toggle')
})