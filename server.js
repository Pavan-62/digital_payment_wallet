// 1. Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');

// 2. Set up express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 3. MongoDB connection
const mongoURI = 'mongodb://localhost:27017/digital_wallet';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 4. Database schema for users
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    upi_id: { type: String, unique: true },
});

// 5. Database model for users
const User = mongoose.model('User', userSchema);

// 6. Transaction schema
const transactionSchema = new mongoose.Schema({
    sender_upi_id: { type: String, required: true },
    receiver_upi_id: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

// 7. Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);

// 8. Generate UPI ID using crypto
function generateUPI() {
    return `upi_${crypto.randomBytes(6).toString('hex')}`;
}

// 9. Routers
// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const upi_id = generateUPI();
        const newUser = new User({ name, email, password, upi_id });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', upi_id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Find user by UPI ID
app.get('/user/:upi_id', async (req, res) => {
    const { upi_id } = req.params;

    try {
        const user = await User.findOne({ upi_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error finding user', error });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
