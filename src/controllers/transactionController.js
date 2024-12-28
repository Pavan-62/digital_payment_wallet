const Transaction = require('../models/transaction');
const User = require('../models/user');

exports.getTransactionsByUPI = async (req, res) => {
    const { upi_id } = req.query;

    try {
        const transactions = await Transaction.find({
            $or: [{ sender_upi_id: upi_id }, { receiver_upi_id: upi_id }]
        });

        res.render('transition', { transactions });
    } catch (error) {
        res.status(500).json({ message: 'Error finding transactions', error });
    }
};

exports.createTransaction = async (req, res) => {
    const { sender_upi_id, receiver_upi_id, amount } = req.body;

    try {
        const sender = await User.findOne({ upi_id: sender_upi_id });
        const receiver = await User.findOne({ upi_id: receiver_upi_id });

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        const transaction = new Transaction({ sender_upi_id, receiver_upi_id, amount });
        await transaction.save();

        res.redirect(`/transition?upi_id=${sender_upi_id}`);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error });
    }
};