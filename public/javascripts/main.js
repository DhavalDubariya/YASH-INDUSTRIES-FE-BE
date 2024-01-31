
// Sound Function
function playSound(soundName){
    if(soundName == true){
        document.getElementById("success-sound").currentTime = 0
        document.getElementById("success-sound").play()
    }

    if(soundName == false){
        document.getElementById("failure-sound").currentTime = 0
        document.getElementById("failure-sound").play()
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