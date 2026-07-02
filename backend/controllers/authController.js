const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ======================
// Register
// ======================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ======================
// Login
// ======================

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent password login for Google accounts
    if (!user.password) {
      return res.status(400).json({
        message:
          "This account was created using Google. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ======================
// Google Login
// ======================

const googleLogin = async (req, res) => {

  try {

    const { credential } = req.body;

    const ticket =
      await client.verifyIdToken({

        idToken: credential,

        audience:
          process.env.GOOGLE_CLIENT_ID,

      });

    const payload =
      ticket.getPayload();

    const {
      sub,
      email,
      name,
      picture,
    } = payload;

    let user =
      await User.findOne({
        email,
      });

    // Create user if first Google login
    if (!user) {

      user =
        await User.create({

          name,

          email,

          googleId: sub,

          picture,

          password: null,

        });

    }

    // Update Google info if needed
    if (!user.googleId) {

      user.googleId = sub;

      user.picture = picture;

      await user.save();

    }

    const token = jwt.sign(

      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

    res.json({

      token,

      user,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Google Login Failed",

      error:
        error.message,

    });

  }

};

module.exports = {

  register,

  login,

  googleLogin,

};