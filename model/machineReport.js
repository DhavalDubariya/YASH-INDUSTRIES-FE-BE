const mongoose = require('mongoose');

const machineReportSchema = new mongoose.Schema({
    machine_time: {
        type: Date,
        required:true
    },
    machine_count: {
        type: Number,
        required:false,
        default: null
    },
    iDate:{ type: Date,require:true},
    machine_id:{type:mongoose.Schema.Types.ObjectId,ref:'Machine',default: null},
    worker_id: {type:mongoose.Schema.Types.ObjectId,ref:'Worker',default: null},
    daily_product_id: {type:mongoose.Schema.Types.ObjectId,ref:'DailyProduct',default: null},
    history_id:  { type: String, default: null },
    flag_deleted: { type: Boolean, default: false },
    change_log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog',required: true,default: null },
    timestamp: { type: Date, default: Date.now }
});
  
  // Create and export Order model
  const MachineReport = mongoose.model('MachineReport', machineReportSchema);
  module.exports = MachineReport;