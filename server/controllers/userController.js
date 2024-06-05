const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");

const registerUser = async (req, res) => {
  // check we have details from frontend
  const { fullName, email, profile, phone, role, password } = req.body;

  const requiredFields = [
    "fullName",
    "email",
    "profile",
    "phone",
    "role",
    "password",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      res.status(400).json({
        status: "failed",
        message: `Missing required field: ${field}`,
        error: true,
      });
      return;
    }
  }

  // check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists in database" });
    return;
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // upload profile photo to cloudinary
  const result = await cloudinary.uploader.upload(profile, {
    folder: "users",
  });

  if (!result) {
    res.status(400).json({ error: "Failed To Upload Photo" });
    return;
  }

  // create user
  const user = await User.create({
    fullName,
    email,
    profile: result.secure_url,
    phone,
    role,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      profile: user.profile,
      phone: user.phone,
      role: user.role,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @login  POST
// http://localhost:5000/api/v1/login
// public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Details missing" });
    return;
  }

  // check if user exists
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      profile: user.profile,
      phone: user.phone,
      role: user.role,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });
  } else {
    res.status(400).send("Invalid credentials");
  }
};

// fetch all users
const allUsers = async (req, res) => {
  const users = await User.find().sort({ $natural: -1 });
  if (users) {
    res.status(200).send(users);
    return;
  }
};

// @user  GET
// http://localhost:5000/api/v1/user/:id
// public
const getUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profile: user.profile,
      phone: user.phone,
      role: user.role,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    };

    res.status(200).send(userWithoutPassword);
  } else {
    res.status(404).send("User not found");
  }
};

// API that checks if sent user exists
const checkIfUserAlreadyExists = async (req, res) => {
  const { email } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      let exists = "exists";
      return res.status(200).send(exists);
    } else {
      let exists = "not exist";
      return res.status(200).send(exists);
    }
  } catch (error) {
    return res.status(400).send("Error Checking");
  }
};

// @Update  PUT
// http://localhost:8000/api/v1/user/:id
const updateMyAccount = async (req, res) => {
  try {
    const { password, ...restOfFields } = req.body;

    // If the request includes a new password, hash it before updating
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      restOfFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      restOfFields,
      {
        new: true,
      }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400).json({ message: "user not found" });
    return;
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: "Could not delete user" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  checkIfUserAlreadyExists,
  updateMyAccount,
  allUsers,
  deleteUser,
};
