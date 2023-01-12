const router = require("express").Router();
const User = require("../data_models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Cart = require("../data_models/Cart");
// --------------------REgister-----------------------------------
router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    // new user
    const savedUser = await newUser.save();
    //new user
    const newCart = new Cart({
      userId: savedUser._id,
    });
    const savedCart = await newCart.save();
    const finalUser = await User.findByIdAndUpdate(
      savedUser._id,
      {
        cartId: newCart._id,
      },
      { new: true }
    );
    const { password, ...others } = finalUser._doc;
    console.log("user registered successfully!");
    console.log("Cart has been Added...");
    res.status(201).json(others);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//-------------------Login------------------------------
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // !user && res.status(401).json("wrong credentials!")
    if (!user) {
      res.status(401).json("wrong username!");
      console.log("wrong username!");
    } else {
      const hashedPass = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8);
      if (originalPassword !== req.body.password) {
        res.status(401).json("wrong password!");
        console.log("wrong password!");
      } else {
        // console.log(user)
        const { password, ...others } = user._doc;
        const accessTokenn = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC_KEY,
          { expiresIn: "1d" }
        );
        others.accessToken = accessTokenn;
        res.status(200).json({ ...others });
        console.log("logged in");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
router.get("/test", (req, res) => {
  try {
    res.status(200).json("test success");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
