const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    material_name: {
        type: String,
        required:true
    },
    material_color: {
        type: String,
        required:true
    },
    material_qty: {
        type: Number,
        required:true
    },
    product_id:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history_id:  { type: String, default: null },
    flag_deleted: { type: Boolean, default: false },
    change_log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog',required: true },
    timestamp: { type: Date, default: Date.now }
});
  
  // Create and export Order model
  const Material = mongoose.model('Order', materialSchema);
  module.exports = Material;