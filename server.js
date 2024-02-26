"use strict";

const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

async function connectToDatabase() {
try {
    await mongoose.connect(
        process.env.MONGODB_URI || "mongodb+srv://lihle:12345@cluster0.c5gdlzz.mongodb.net/html_login",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}
}

connectToDatabase();

// Create a schema for user data
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Set up middleware to parse JSON
app.use(express.json());

// Create a model based on the schema
const UserModel = mongoose.model("User", userSchema, "users");


// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// Handle form submissions
app.post('/users', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Received data:', { email, password });

        // Hash password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('Hashed password:', hashedPassword);

        const newUser = new UserModel({
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({ success: true, message: 'User created successfully!' });
    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(400).json({ success: false, message: 'Error creating user' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
