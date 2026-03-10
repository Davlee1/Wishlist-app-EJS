const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide item name"],
      maxlength: 100,
    },
    imageURL: {
      type: String,
      required: false,
      
      
    },
    link: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      maxlength: 50,
      required: false,
    },
    //1 = most wanted, 5 = least important
    priority: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: "3",
      
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
