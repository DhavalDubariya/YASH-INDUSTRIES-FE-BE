// var constant = require("../helpers/consts");
//Change Log
var fs = require("fs");
//Crete Access token
async function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  console.log(result);
  return result;
}

//Format Date And Time
const formatDateTimeLib = async (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = "" + d.getHours(),
    minute = "" + d.getMinutes(),
    second = "" + d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;
  if (second.length < 2) second = "0" + second;

  var str = [year, month, day].join("-");
  return str + " " + hour + ":" + minute + ":" + second;
};

//Format Date
const formatDateLib = async (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = "" + d.getHours(),
    minute = "" + d.getMinutes(),
    second = "" + d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;
  if (second.length < 2) second = "0" + second;

  var str = [year, month, day].join("-");
  return str;
};

//Expiry Time 'expiry_minute_time' In Minute
async function expiryTime(expiry_minute_time) {
  let expiry_time = new Date(
    new Date().getTime() + expiry_minute_time * 1440000
  );
  let expiry_time_string = await formatDateTimeLib(expiry_time);
  return expiry_time_string;
}

const downloadImage = async (imageUrl, filePath) => {
  try {
    const file = fs.createWriteStream(filePath);

    const response = await new Promise((resolve, reject) => {
      https.get(imageUrl, resolve).on("error", reject);
    });

    await response.pipe(file);

    await new Promise((resolve, reject) => {
      file.on("finish", resolve);
      file.on("error", reject);
    });
    return {
      status: true,
      data: filePath,
    };
  } catch (error) {
    return {
      status: false,
      data: error,
    };
  }
};

async function generateOTP(length) {
  var result = "";
  var characters = "1234567890";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  console.log(result);
  return result;
}
async function expiryTimeInMin(minute) {
  let expiry_time_in_min = new Date(new Date().getTime() + 1000 * 60 * minute);
  let expiry_time_string = await formatDateTimeLib(expiry_time_in_min);
  return expiry_time_string;
}

const getExpireTimeStamp = async (flag) => {
  if (flag) {
    var expireTimeStamp = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000 * 30
    );
  } else {
    var expireTimeStamp = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  }

  return expireTimeStamp;
};

async function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

const objValidator = async (array) => {
  var result =
    array
      .map((x) => {
        if (typeof x == "boolean") {
          if (x == undefined) {
            return true;
          }
        } else {
          if (x == undefined || x == null || x == "") {
            return true;
          }
        }
      })
      .filter((x) => x == true).length != 0
      ? false
      : true;
  return result;
};


module.exports = {
  makeid: makeid,
  formatDateLib: formatDateLib,
  formatDateTimeLib: formatDateTimeLib,
  generateOTP: generateOTP,
  expiryTime: expiryTime,
  
  downloadImage: downloadImage,
  expiryTimeInMin: expiryTimeInMin,
  getExpireTimeStamp: getExpireTimeStamp,
  objValidator: objValidator
};
