const mongoose = require('mongoose');

const rejectionReportSchema = new mongoose.Schema({
    rejection_count: {type: Number,required:false,default: null},
    iDate:{ type: Date,require:true},
    daily_product_id: {type:mongoose.Schema.Types.ObjectId,ref:'DailyProduct',default: null},
    machine_id:{type:mongoose.Schema.Types.ObjectId,ref:'Machine',require:true},
    history_id:  { type: String, default: null },
    flag_deleted: { type: Boolean, default: false },
    flag_day_shift:{ type: Boolean, require:true },
    change_log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog',required: false,default: null },
    timestamp: { type: Date, default: Date.now }
});
  
  // Create and export Order model
  const RejectionReport = mongoose.model('RejectionReport', rejectionReportSchema);
  module.exports = RejectionReport;