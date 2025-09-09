import { generateToken } from "../lib/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { name, email, phone, password, state, district } = req.body;
  try {
    // Check if required fields are present
    if (!name || (!email && !phone) || !password || !state || !district) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // Check if user already exists
    if (email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists)
        return res.status(400).json({ message: "Email already exists" });
    } else if (phone) {
      const exists = await User.findOne({ phone });
      if (exists)
        return res.status(400).json({ message: "Phone Number already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email: email ? email.toLowerCase() : undefined, // Only set email if provided
      phone,
      password: hashedPassword,
      state,
      district,
    });

    // Save user to database
    await newUser.save();

    // Generate token and send response
    generateToken(newUser._id, res);
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        state: newUser.state,
        district: newUser.district,
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    // Check if required fields are present
    if ((!phone && !email) || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email or phone
    let user = null;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token and send response
    generateToken(user._id, res);
    res.status(200).json({message:"Logged in successfull"});
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID
    let updateData = req.body;   // Get update data

    // Validate userId and update data
    if (!userId || !updateData) {
      return res.status(400).json({ error: "Invalid request data." });
    }

    // Remove empty fields (null, undefined, empty string)
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === '' || updateData[key] == null) {
        delete updateData[key];
      }
    });

    // Ensure at least one unique field is provided
    if (!updateData.email && !updateData.phone) {
      return res.status(400).json({ error: "Email or phone is required." });
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,           // Return updated document
      runValidators: true, // Ensure schema validation
      context: "query",    // Required for conditional validation
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json("updated success");
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const chcekAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
};