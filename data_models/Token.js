const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    expireIn: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
