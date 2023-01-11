const router = require("express").Router();
const Cart = require("../data_models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyTokenRoute");

// create cart
router.post("/", async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    console.log("Cart has been Added...");
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.put("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    console.log("req body:", req.body);
    const productToBeUpdated = await Cart.updateOne(
      { _id: req.body.cartId, "products.cartPageId": req.body.cartPageId },
      {
        $inc: {
          "products.$.quantity": req.body.quantity,
          total: req.body.quantity * req.body.price,
        },
      },
      { multi: true }
    );
    console.log(productToBeUpdated);
    console.log(`Cart has been updated`);
    res.status(200).json(productToBeUpdated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// add prdocuts from localstorage
router.put(
  "/product/:userId",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const productToBeUpdated = await Cart.updateOne(
        { _id: req.body.cartId },
        {
          $inc: {
            quantity: req.body.quantity,
            total: req.body.total,
          },
          $push: { products: req.body.products },
        },
        { multi: true }
      );
      console.log(`Cart has been updated`);
      res.status(200).json(productToBeUpdated);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);
// delte prdocut from db cart
router.put("/delete/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const productToBeUpdated = await Cart.updateOne(
      { _id: req.body.cartId },
      {
        $inc: {
          quantity: -1,
          total: req.body.price,
        },
        $pull: { products: { cartPageId: req.body.cartPageId } },
      },
      { multi: true }
    );
    console.log(`product has been deleted`);
    res.status(200).json(productToBeUpdated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// clear  cart
router.put("/clear/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const productToBeUpdated = await Cart.updateOne(
      { _id: req.body.cartId },
      {
        $set: {
          quantity: 0,
          total: 0,
          products: [],
        },
      },
      { multi: true }
    );
    console.log(`cart has been cleared`);
    res.status(200).json(productToBeUpdated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    console.log("Cart has been deleted...");
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user Cart
router.get("/find/:cartId", verifyToken, async (req, res) => {
  try {
    console.log(req.params.cartId);
    const cart = await Cart.findById(req.params.cartId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//  Admin gets All Carts of all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
/*
// Update
router.put("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    console.log("req body:", req.body);
    // const updatedCart = await Cart.findByIdAndUpdate(
    //   req.body.cartId,
    //   {
    //     cartPageId: req.body.cartPageId,
    //   },
    //   { new: true }
    // );
    // const cartToBeUpdated = await Cart.findByIdAndUpdate(req.body.cartId, {
    //   $inc: { total: req.body.quantity * req.body.price },
    // });
    const productToBeUpdated = await Cart.updateOne(
      { _id: req.body.cartId, "products.cartPageId": req.body.cartPageId },
      {
        $inc: {
          "products.$.quantity": 1,
          total: 1,
        },
      },
      { multi: true }
    );
    console.log(productToBeUpdated);
    // console.log("cartToBeUpdated,cartToBeUpdated", cartToBeUpdated);
    // cartToBeUpdated.products.forEach((dbProduct) => {
    //   console.log("dbProduct.cartPageId", dbProduct);
    // if (dbProduct.cartPageId === req.body.cartPageId) {
    //   console.log("HHHEEERRREEE");
    //   cartToBeUpdated.set({
    //     "dbProduct.quantity": dbProduct.quantity + req.body.quantity,
    //     "cartToBeUpdated.total":
    //       cartToBeUpdated.total + req.body.quantity * req.body.price,
    //   });
    // }
    // });
    // const updatedCart = await cartToBeUpdated.save();
    // console.log("updatedCart", updatedCart);
    console.log(`Cart has been updated`);
    res.status(200).json(productToBeUpdated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
*/

// update the whole cart

/*
/ Update
router.put("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    console.log("req body:", req.body);
    const productToBeUpdated = await Cart.updateOne(
      { _id: req.body.cartId },
      {
        $set: {
          products: req.body.products,
          quantity: req.body.quantity,
          total: req.body.total,
        },
      },
      { new: true }
    );
    console.log(productToBeUpdated);
    console.log(`Cart has been updated`);
    res.status(200).json(productToBeUpdated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
*/
