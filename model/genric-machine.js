const mongoose = require('mongoose');

const genricMachineSchema = new mongoose.Schema({
    machine_time: {
        type: String,
        required:true
    },
    flag_day_shift: { type: Boolean, default: true },
    seq_no:{ type: Number,require:true}
});
  
  // Create and export Order model
  const GenricMachine = mongoose.model('GenricMachine', genricMachineSchema);
  module.exports = GenricMachine;