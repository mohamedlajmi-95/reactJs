const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mohamedlajmi1995.com",
    pass: "nzmx auty vfac dgtn",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//Create a new User
router.post("/register", async (req, res) => {
  try {
    let { email, password, firstname, lastname } = req.body;
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(404)
        .send({ success: false, message: "User already exists" });

    const newUser = new User({ email, password, firstname, lastname });
    const createdUser = await newUser.save();

    // sending a confirmation Email

    const mailOption = {
      from: '"verify your email " <esps421@gmail.com>',
      to: newUser.email,
      subject: "Account activation ",
      html: `<h2>${newUser.firstname}! thank you for registreting on our website</h2>

  <h4>please verify your email to procced.. </h4>
  <a href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">click here</a>`,
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("verification email sent to your gmail account ");
      }
    });

    return res.status(201).send({
      success: true,
      message: "Account created successfully",
      user: createdUser,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ success: false, message: error });
  }
});

// Show list of users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// activate or inactivate a user
router.get("/status/edit", async (req, res) => {
  try {
    let email = req.query.email;
    let user = await User.findOne({ email });
    user.isActive = !user.isActive;
    user.save();
    res.status(200).send({ success: true, user });
  } catch (error) {
    return res.status(404).send({ success: false, message: err });
  }
});

// connect
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    // one of them is empty
    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, message: "all field are required" });
    }
    let user = await User.findOne({ email }); //find the user who has an email
    if (!user) {
      // there is no user
      return res
        .status(404)
        .send({ success: false, message: "Account doesn't exist " });
    } else {
      //bcrypt.compare is a method to bcrypt a password and compare it with the passwords from the Database
      let isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) {
        delete user._doc.password;
        if (!user.isActive)
          return res.status(200).send({
            success: false,
            message:
              "Your account is inactive, please contact your administrator",
          });
        const token = jwt.sign(
          { iduser: user._id, name: user.firstname, role: user.role },
          //.SECRET must be in file .env => just a random secret
          process.env.SECRET,
          { expiresIn: "24h" }
        );
        return res.status(200).send({ success: true, user, token });
      } else {
        return res.status(404).send({
          success: false,
          message: "Please verify your credentials",
        });
      }
    }
  } catch (error) {
    return res.status(404).send({ success: false, message: err.message });
  }
});
module.exports = router;
