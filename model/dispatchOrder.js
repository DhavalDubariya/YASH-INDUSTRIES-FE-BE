const mongoose = require('mongoose');

const dispatchOrder = new mongoose.Schema({
    iDate:{ type: Date },
    number_plate:{type:String,require:true},
    driver_name:{type:String,require:true},
    order_id:{type:mongoose.Schema.Types.ObjectId,ref:'Order'},
    history_id:  { type: String, default: null },
    flag_deleted: { type: Boolean, default: false },
    change_log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog',required: true },
    timestamp: { type: Date, default: Date.now },
    products: [{
        product_id: {
            type: String,
            required: true
        },
        product_count: {
            type: Number,
            required: true
        }
    }]
});
  
  // Create and export Order model
  const DispatchOrder = mongoose.model('DispatchOrder', dispatchOrder);
  module.exports = DispatchOrder;