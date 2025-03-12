const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register controller
const registerUser = async (req, res) => {
  try {
    // extract user info from our request body
    const { username, email, password, role } = req.body;

    // check if the user is already exists in our database
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with same username or email! ",
      });
    }

    // hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user and save in your database
    const newlyCreatedUser = User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "unable to register user",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // find if the current user exists in the database or not
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesnt exists !",
      });
    }

    // check if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect !",
      });
    }

    // bearer Token
    // create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    // return when login is successful
    res.status(200).json({
      success: true,
      message: "Login successful !",
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// change password
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // extract old and new password
    const { oldPassword, newPassword } = req.body;

    // find the current login user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    // check if the old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct , Please try again !",
      });
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword,salt);

    // update user password 
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error !'
    })
  }
};




module.exports = { registerUser, loginUser , changePassword};
