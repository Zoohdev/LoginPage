// create server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// connect database
mongoose.connect('mongodb+srv://admin:1234@cluster0.jtfy1bf.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

const inappropriateWords = ["poop", "damn", "coitus"];

const inappropriateUsernameMiddleware = (req, res, next) => {
  const username = req.body.username;

  const containsInappropriateWord = inappropriateWords.some(word =>
    username.toLowerCase().includes(word.toLowerCase())
  );

  if (containsInappropriateWord) {
    return res.status(400).json({ error: "Username contains inappropriate words." });
  }

  next();
};

const response = await axios.post('http://localhost:3000/login', {
    username,
    password,
});


app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, 'secret_key');

        // Send the token and redirect URL as a response
        res.json({ token, redirect: '/index.html' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



