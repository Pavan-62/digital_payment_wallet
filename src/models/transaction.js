const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender_upi_id: { type: String, required: true },
    receiver_upi_id: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;