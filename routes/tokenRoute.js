const router = require("express").Router();
const User = require("../data_models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// --------------------REgister-----------------------------------
router.post("/token", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    //res.status(201).send("successfully added to the database")
    const { password, ...others } = savedUser._doc;
    console.log("user registered successfully!");
    res.status(201).json(others);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
