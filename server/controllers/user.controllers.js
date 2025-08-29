const User = require("../models/User.models");
const RefreshToken = require("../models/RefreshToken.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// OTP storage in memory (replace with Redis for prod)
let otpStore = {};

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Step 1: Register request (send OTP)
const registerRequest = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = { otp, username, password, expires: Date.now() + 5 * 60 * 1000 };

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    });

    return res.json({ msg: `OTP sent to email ${otp}` });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Step 2: Verify OTP and create account
const registerVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record) return res.status(400).json({ msg: "No OTP requested" });

    if (record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(record.password, 10);

    const user = await User.create({
      username: record.username,
      email,
      password: hashedPassword,
    });

    delete otpStore[email];

    return res.json({ msg: "Registration successful", userId: user._id });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Refresh token
const refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const stored = await RefreshToken.findOne({ token, revoked: false });
    if (!stored) return res.status(403).json({ msg: "Invalid refresh token" });

    jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Invalid refresh token" });

      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );
      return res.json({ accessToken });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ msg: "No token provided" });

    const stored = await RefreshToken.findOne({ token });
    if (!stored) return res.status(400).json({ msg: "Token not found" });

    stored.revoked = true;
    await stored.save();

    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { registerRequest, registerVerify, login, refresh, logout };
