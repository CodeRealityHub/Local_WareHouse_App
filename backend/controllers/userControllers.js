import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ==================== USER MANAGEMENT (ADMIN/MANAGER) ====================

// create a users
export const createUser = async (req, res) => {
  console.log("RECEIVED REQ.BODY:", req.body);
  try {
    const { name, email, password, role} = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({
            message: "User already exists",
        });
    }  
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashedpassword,
        role: role || "Admin",
    });

    res.status(201).json({
        message: "User created successfully",
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
    });
  } catch (error) {
     console.error(error);
     res.status(500).json({
        message: "Server Error",
     });
  }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get single user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user by ID
// Update user by ID
export const updateUser = async (req, res) => {
    try {
       // If password is being updated, hash it first
       let upData = { ...req.body };
       if (upData.password && upData.password.trim() !== "") {
           const salt = await bcrypt.genSalt(10);
           upData.password = await bcrypt.hash(upData.password, salt);
       } else {
           // Prevent overwriting password with an empty string if omitted
           delete upData.password;
       }

        const updatedData = await User.findByIdAndUpdate(
            req.params.id, 
            upData, // <-- FIXED: Use upData instead of req.body here
            { new: true, runValidators: true }
        ).select("-password");
        
        if (!updatedData) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User updated successfully", user: updatedData });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if another user already uses this email
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
    if (role !== "") updateData.role = role;

    // Hash password securely only if a new non-empty password is supplied
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

// Get current user profile
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