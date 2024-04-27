const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_no: {
      type: Number,
      required: true
    },
    order_name: {
      type: String,
      required: true,
      default: null
    },
    delivery_date: {
      type: Date,
      required: false,
      default: null
    },
    driver_name: {
      type: String,
      required: false,
      default: null
    },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer',required:true },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default: null },
    history_id:  { type: String, default: null },
    flag_deleted: { type: Boolean, default: false },
    change_log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog',required: true },
    timestamp: { type: Date, default: Date.now }
  });
  
  // Create and export Order model
  const CustomerOrder =  mongoose.model('CustomerOrder', orderSchema);
  module.exports = CustomerOrder
  
