const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        productId: {
          type: String,
        },
        cartPageId: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        title: {
          type: String,
        },
        desc: {
          type: String,
        },
        img: {
          type: String,
        },
        categories: {
          type: Array,
        },
        size: {
          type: String,
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
        },
        inStock: {
          type: Boolean,
        },
      },
    ],
    quantity: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
