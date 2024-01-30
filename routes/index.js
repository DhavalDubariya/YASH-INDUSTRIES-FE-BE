var express = require('express');
var router = express.Router();

/* home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Login page. */
router.get('/login',function(req,res,next){
  res.render('sign-in',{ title: 'Sign In' })
})

/* Customer page. */
router.get('/customer',function(req,res,next){
  res.render('customer',{ title: 'Sign In' })
})


module.exports = router;
