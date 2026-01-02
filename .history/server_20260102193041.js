const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const User = require("./userModel");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/loginSystem")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Register
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ msg: "All fields required" });

    const userExists = await User.findOne({ email });
    if (userExists)
        return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.json({ msg: "Registration successful" });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials" });

    res.json({ msg: "Login successful", name: user.name });
});

app.listen(5000, () => console.log("Server running on port 5000"));
