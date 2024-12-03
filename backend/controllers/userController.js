const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateJWT, verifyJWT } = require("../utils/generateToken");
const transporter = require("../utils/transporter");

async function createUser(req, res) {
  const { name, password, email } = req.body;

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please enter the name",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the password",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter the email",
      });
    }

    const checkForexistingUser = await User.findOne({ email });

    if (checkForexistingUser) {
      if (checkForexistingUser.verify) {
        return res.status(400).json({
          success: false,
          message: "User already registered with this email",
        });
      } else {
        let verificationToken = await generateJWT({
          email: checkForexistingUser.email,
          id: checkForexistingUser._id,
        });

        //email logic

        const sendingEmail = transporter.sendMail({
          from: "ns0109375@gmail.com",
          to: checkForexistingUser.email,
          subject: "Email Verification",
          text: "Please verify your email",
          html: `<h1>Click on the link to verify your email</h1>
              <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>`,
        });

        return res.status(200).json({
          success: true,
          message: "Please Check Your Email to verify your account",
        });
      }
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
    });

    let verificationToken = await generateJWT({
      email: newUser.email,
      id: newUser._id,
    });

    //email logic

    const sendingEmail = transporter.sendMail({
      from: "ns0109375@gmail.com",
      to: email,
      subject: "Email Verification",
      text: "Please verify your email",
      html: `<h1>Click on the link to verify your email</h1>
          <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>`,
    });

    return res.status(200).json({
      success: true,
      message: "Please Check Your Email to verify your account",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function verifyToken(req, res) {
  try {
    const { verificationToken } = req.params;

    const verifyToken = await verifyJWT(verificationToken);

    if (!verifyToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token/Email expired",
      });
    }
    const { id } = verifyToken;
    const user = await User.findByIdAndUpdate(
      id,
      { isVerify: true },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function login(req, res) {
  const { password, email } = req.body;

  try {
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the password",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter the email",
      });
    }

    const checkForexistingUser = await User.findOne({ email });

    if (!checkForexistingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }
    if (!checkForexistingUser.verify) {
      // send verification email
      let verificationToken = await generateJWT({
        email: checkForexistingUser.email,
        id: checkForexistingUser._id,
      });

      //email logic

      const sendingEmail = transporter.sendMail({
        from: "ns0109375@gmail.com",
        to: checkForexistingUser.email,
        subject: "Email Verification",
        text: "Please verify your email",
        html: `<h1>Click on the link to verify your email</h1>
              <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>`,
      });

      return res.status(400).json({
        success: false,
        message: "Please verify you email",
      });
    }

    let checkForPass = await bcrypt.compare(
      password,
      checkForexistingUser.password
    );

    if (!checkForPass) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    let token = await generateJWT({
      email: checkForexistingUser.email,
      id: checkForexistingUser._id,
    });

    // => #, A, a ,1 , 6 <-> 20

    return res.status(200).json({
      success: true,
      message: "logged in successfully",
      user: {
        id: checkForexistingUser._id,
        name: checkForexistingUser.name,
        email: checkForexistingUser.email,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const id = req.params.id;
    // db call
    console.log(id);

    const user = await User.findById(id);

    console.log(user);
    // console.log(user._id);
    // console.log(user.id);

    // const user1 = await User.findOne()

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    // db call
    const id = req.params.id;

    const { name, password, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, password, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const id = req.params.id;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  verifyToken,
};
