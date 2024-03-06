const mongoose = require('mongoose');

// Define Product schema
const productSchema = new mongoose.Schema({
    product_name: {
    type: String,
    required: true
    },
    product_qty: {
    type: Number,
    required: true
    },
    runner: {
    type: Number,
    required: true
    },
    order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
    },
    history_id:  { type: String, default: null },
    flag_deleted: { type: Boolean, default: false },
    change_log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChangeLog',required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create and export Product model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
