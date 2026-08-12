import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists (fixed Email -> email)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving (fixed Password -> password)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password (fixed Password -> password)
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role,
        });
        await newUser.save();

        // Omit password from response object
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ message: "User registered successfully", user: userResponse });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists (fixed Email -> email)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password is correct using bcrypt (fixed Password -> password)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Omit password from response object
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({ 
            message: "User logged in successfully", 
            token, 
            user: userResponse 
        });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout a user
export const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error logging out user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};  

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user profile (Authenticated User)
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if another user already uses this email (fixed Email -> email)
    if (email && email !== currentUser.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    let updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
 
    // Hash password securely only if a new non-empty password is supplied (fixed Password -> password)
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

  } catch (error) {
    console.error("Error updating profile:", error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};