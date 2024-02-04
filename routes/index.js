var express = require('express');
var router = express.Router();

/* home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* Login page. */
router.get('/login',function(req,res,next){
  res.render('sign-in',{ title: 'Login' })
})

/* Customer page. */
router.get('/customer',function(req,res,next){
  res.render('customer',{ title: 'Customer' })
})

/* Customer detail. */
router.get('/customer-detail',function(req,res,next){
  res.render('customer-detail',{ title: 'Customer Detail' })
})

/* Create product */
router.get('/product',function(req,res,next){
  res.render('product',{ title: 'Create Product' })
})

module.exports = router;
