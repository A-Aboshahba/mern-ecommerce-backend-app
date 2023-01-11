const router = require("express").Router();
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51LgYv4KCMRiQhSg51ru7XfxSbKtrwB50Xe14lus4a74RrH7WO7OrxM4n4QsZFBjSXQB3WUEblUxj01JN1Se0r8xn00jDp6mZcx"
);
const { verifyToken } = require("./verifyTokenRoute");

router.post("/payment", verifyToken, (req, res) => {
  console.log("stripe", req.body);
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        console.log("1", stripeErr);
        res.status(500).json(stripeErr);
      } else {
        console.log("stripeRes", stripeRes);
        res.status(200).json(stripeRes);
      }
    }
  );
});
module.exports = router;
