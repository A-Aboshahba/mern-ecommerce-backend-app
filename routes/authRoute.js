const router = require("express").Router()
const User = require("../data_models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

// --------------------REgister-----------------------------------
router.post("/register" , async (req,res)=>{
    const newUser = new User ({
        username : req.body.username ,
        email : req.body.email ,
        password : CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SEC)
            .toString(),
    });
    try {
    const savedUser = await newUser.save()
    //res.status(201).send("successfully added to the database")
    const {password, ...others } = savedUser._doc;
    console.log("user registered successfully!")
    res.status(201).json(others)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})


//-------------------Login------------------------------
router.post("/login", async (req,res)=>{
    try {
        const user = await User.findOne({username : req.body.username});
         // !user && res.status(401).json("wrong credentials!")
        if (!user)  {
            res.status(401).json("wrong username!")
            console.log("wrong username!")
        } else {
            const hashedPass = CryptoJS.AES.decrypt(user.password , process.env.PASS_SEC)
            const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8)
            if (originalPassword !== req.body.password) {
                res.status(401).json("wrong password!")
                console.log("wrong password!")
            } else {
            // console.log(user)
            const {password, ...others } = user._doc;
            const accessToken = jwt.sign(
                {
                    id : user._id , 
                    isAdmin : user.isAdmin,
                },
                process.env.JWT_SEC_KEY,
                {expiresIn : "3d" }
            );
            res.status(200).json({...others , accessToken})
            console.log("logged in")
            }
        }
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})


module.exports = router ;