// app.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.json());

const connectDB = async () => {
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/mean'
    //   , { useNewUrlParser: true, useUnifiedTopology: true }
      );
      console.error('CONNECT TO DATABASE:', conn);
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
}

connectDB();

// Define user schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by id
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(404).json({ message: 'User not found'  });
    }
});

// home route
app.get('/', (req, res) => {
  res.send('Home ...');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});