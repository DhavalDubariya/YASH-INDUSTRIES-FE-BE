// Import mongoose
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
});

// Create the user model
const User = mongoose.model('User', userSchema);

// Export the user model to use it elsewhere in your application
module.exports = User;
