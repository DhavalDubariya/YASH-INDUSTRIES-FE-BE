const mongoose = require('mongoose');

// Define schema
const customerSchema = new mongoose.Schema({
    company_name: String,
    phone_number: { type: String, required: true },
    customer_name:  { type: String, required: true },
    city: String,
    address: String,
    history_id:  { type: String, default: null },
    flag_deleted: { type: Boolean, default: false },
    change_log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog' },
    timestamp: { type: Date, default: Date.now }
});

// Create model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;