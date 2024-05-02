const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    machine_name: {
        type: String,
        required:true
    },
    flag_deleted: { type: Boolean, default: false }
});
  
  // Create and export Order model
  const Machine = mongoose.model('Machine', machineSchema);
  module.exports = Machine;