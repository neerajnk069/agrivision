const db = require("../../models");
const helper = require("../../helper/helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Secret_key = process.env.secret_key;

const Users = db.users;

exports.signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    let image = "";

    if (req.files && req.files.image) {
      image = await helper.fileUpload(req.files.image);
    }

    const newUser = await Users.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: role || "1",
      otpVerify: "1",
      status: "1",
      image,
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role,
      },
      Secret_key,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
