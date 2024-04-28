console.log('Dhaval')
$('#login-button').on('click',function (event) {
    event.preventDefault()
    var loginForm = $('#login-form').serializeArray()
    if($('#login-form')[0].checkValidity() == false ){
        $('#login-message').attr('style', 'color: red !important')
        $('#login-message').text('Invalid Email Or Password')
        return 
    }
    console.log(loginForm)
    showLoader()
    $.ajax({
        url: "api/user/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(keyValueObject(loginForm)), // Replace with your data
        success: function(response) {
            console.log(response)
          if(response.status == false){
            $('#login-message').attr('style', 'color: red !important')
            $('#login-message').text(response.error)
          }  
          sessionStorage.setItem("yi-ssid",response.data.accee_token);
          document.cookie = response.data.accee_token
          window.location = '/'
        },
        error: function(xhr, status, error) {
          $('#login-message').attr('style', 'color: red !important')
          $('#login-message').text('Somthing want wrong!')
        },
        complete: function() {
          hideLoader()
        }
      });
})

// Function to disable user interaction and show loader
function showLoader() {
  $("#loder-body").fadeIn();
  $("body").css("pointer-events", "none");
}

// Function to enable user interaction and hide loader
function hideLoader() {
  $("#loder-body").fadeOut();
  $("body").css("pointer-events", "auto");
}

function keyValueObject(array) {
  const keyValueObject = {};
  array.forEach(item => {
      keyValueObject[item.name] = item.value;
  });
  return keyValueObject;
}