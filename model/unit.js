const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    iDate: {
        type: Date,
        required:true
    },
    flag_deleted: { type: Boolean, default: false },
    unit_count:{ type: Number,require:true },
    machine_id:{type:mongoose.Schema.Types.ObjectId,ref:'Machine',require:true},
});
  
  // Create and export Order model
  const Unit = mongoose.model('Unit', unitSchema);
  module.exports = Unit;