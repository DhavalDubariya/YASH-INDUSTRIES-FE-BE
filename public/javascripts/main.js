// Sound Function
var userDetail 
function playSound(soundName) {
  if (soundName == true) {
    document.getElementById("success-sound").currentTime = 0;
    document.getElementById("success-sound").play();
  }

  if (soundName == false) {
    document.getElementById("failure-sound").currentTime = 0;
    document.getElementById("failure-sound").play();
  }
}

// Add Br Teg In String
function addBrTag(text) {
  var words = text.split(" ");
  var result = "";
  for (var i = 0; i < words.length; i++) {
    result += words[i];
    if ((i + 1) % 4 === 0) {
      result += "<br>";
    } else {
      result += " ";
    }
  }
  return result;
}


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

$(document).ready(function(){
  $.ajax({
    url: "api/user/me",
    type: "GET",
    contentType: "application/json",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem("yi-ssid")
    },
    // Replace with your data
    success: function(response) {
      userDetail = response.data
    },
    error: function(xhr, status, error) {
      window.location = '/login'
    },
    complete: function() {
      // hideLoader()
    }
  });
})
