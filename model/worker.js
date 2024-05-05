// Import mongoose
const mongoose = require('mongoose');

// Define the user schema
const workerSchema = new mongoose.Schema({
  worker_name: { type: String, required: true },
  start_date: { type: Date, default: null },
  flag_deleted: { type: Boolean, required: true },
  history_id:  { type: String, default: null },
  flag_deleted: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

// Create the user model
const Worker = mongoose.model('Worker', workerSchema);

// Export the user model to use it elsewhere in your application
module.exports = Worker;
