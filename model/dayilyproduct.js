const mongoose = require('mongoose');

const dailyProduct = new mongoose.Schema({
    customer_id:{type:mongoose.Schema.Types.ObjectId,ref:'Customer'},
    order_id:{type:mongoose.Schema.Types.ObjectId,ref:'Order'},
    product_id:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
    history_id:  { type: String, default: null },
    flag_deleted: { type: Boolean, default: false },
    change_log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog',required: true },
    timestamp: { type: Date, default: Date.now },
    iDate:{ type: Date }
});
  
  // Create and export Order model
  const DailyProduct = mongoose.model('DailyProduct', dailyProduct);
  module.exports = DailyProduct;