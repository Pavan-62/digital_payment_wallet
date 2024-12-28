// 1. Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// 2. Set up express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the public directory
app.use('/public', express.static(__dirname + '/public'));

// 3. MongoDB connection
const mongoURI = 'mongodb+srv://pavankumar:heypavan42%40@cluster0.kqiok.mongodb.net/digital_wallet?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));
//4.Define Home route
    app.get('/', (req, res) => {
        res.render('index');
    });    
// 5. Use routes
app.use('/', userRoutes);
app.use('/', transactionRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});