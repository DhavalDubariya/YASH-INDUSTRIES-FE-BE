const db = require('../model/index')


const checkAccessToken = async (req, res, next) => {
  console.log(
    "Cookies:::::::::::::::::::::::::::::::::::::::::::::::::::::",
    req.cookies["yi-ssid"]
  );

  var authTokenHeader = req.cookies["yi-ssid"] || req.headers["authorization"];
  if (authTokenHeader) authTokenHeader = authTokenHeader.replace("Bearer ", "");
  var accessToken = authTokenHeader;
  console.log(accessToken);
  if (accessToken === undefined) {
    console.log("There is no Token");
    return res.status(401).send({
      status: false,
      error: {
        code: 401,
        message: "Error invalid authentication found ...................",
      },
    });
  }
  var date = new Date();

  let currentTimeStamp = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const result = await db.UserAccessToken.findOne({token:authTokenHeader,expireTime:{ $gte: currentTimeStamp }});
  if(!result){
    return res.status(401).send({
        status: false,
        error: {
          code: 401,
          message: "Error invalid authentication found",
        },
      });
  }
  req["accee_token"] = authTokenHeader
  req["user_id"] = result.user_id
  next();
};


module.exports = {
  checkAccessToken: checkAccessToken
};
