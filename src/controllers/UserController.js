const User = require('../models/user');
const crypto = require('crypto');
const Transaction = require('../models/transaction'); // Ensure this is imported

function generateUPI() {
    return `upi_${crypto.randomBytes(6).toString('hex')}`;
}

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const upi_id = generateUPI();
        const newUser = new User({ name, email, password, upi_id });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error); // Log the error details
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.redirect(`/transition?upi_id=${user.upi_id}`);
    } catch (error) {
        console.error('Error logging in:', error); // Log the error details
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

exports.getUserByUPI = async (req, res) => {
    const { upi_id } = req.query;

    try {
        const user = await User.findOne({ upi_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const transactions = await Transaction.find({
            $or: [{ sender_upi_id: upi_id }, { receiver_upi_id: upi_id }]
        });

        res.render('transition', { user, transactions });
    } catch (error) {
        console.error('Error finding user:', error); // Log the error details
        res.status(500).json({ message: 'Error finding user', error: error.message });
    }
};