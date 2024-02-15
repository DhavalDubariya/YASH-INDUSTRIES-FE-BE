const mongoose = require('mongoose');

// Define the userAccessToken schema
const userAccessTokenSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  expireTime: { type: Date, required: true },
  flag_log_out: { type: Boolean, default: false }
});

// Create the userAccessToken model
const UserAccessToken = mongoose.model('UserAccessToken', userAccessTokenSchema);

// Export the model for use in other parts of your application
module.exports = UserAccessToken;
