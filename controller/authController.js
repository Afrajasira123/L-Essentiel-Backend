import { BadRequestError } from "../errors/customErrors.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register user
export const registerUser = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hash,
      phone: phone,
    });
    await newUser.save();
    res.status(200).json({ message: "Created successfully", newUser });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

//login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user?._id, role: user?.role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 30),
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      message: "Logged in Success",
      user: {
        _id: user?._id,
        username: user?.username,
        email: user?.email,
        role: user?.role,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged Out success" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
