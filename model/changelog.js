const mongoose = require('mongoose');

// Define schema
const changeLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true } // Assuming 'User' is another Mongoose model
});

// Create model
const ChangeLog = mongoose.model('ChangeLog', changeLogSchema);

module.exports = ChangeLog;
