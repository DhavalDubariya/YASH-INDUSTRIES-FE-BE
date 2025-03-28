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

/* Daily Report */
router.get('/daily-report',function(req,res,next){
  res.render('daily-report',{ title: 'Daily Report' })
})

router.get('/order-detail',function(req,res,next){
  res.render('order-detail',{ title: 'Daily Report' })
})

router.get('/machine-report',function(req,res,next){
  res.render('machine-report',{ title: 'Daily Report' })
})

router.get('/dispatch-order',function(req,res,next){
  res.render('dispatch-order',{ title: 'Daily Report' })
})

router.get('/dispatch',function(req,res,next){
  res.render('dispatch',{ title: 'Daily Report' })
})

router.get('/print-dispatch',function(req,res,next){
  res.render('print-dispatch',{ title: 'Daily Report' })
})

router.get('/daily-machine-report',function(req,res,next){
  res.render('daily-machine-report',{ title: 'Daily Machine Report' })
})

router.get('/daily-machine-print',function(req,res,next){
  res.render('daily-machine-report-2',{ title: 'Daily Machine Report' })
})

router.get('/order-dispatch',function(req,res,next){
  res.render('order-dispatch',{ title: 'Daily Machine Report' })
})

router.get('/test',function(req,res,next){
  res.render('test',{ title: 'Daily Report' })
})
module.exports = router;
