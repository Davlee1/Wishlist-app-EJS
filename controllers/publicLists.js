const PublicLists = require("../models/publicLists");
const parseVErr = require("../utils/parseValidationErrs");

const getAllLists = async (req, res) => {
  const Lists = await PublicLists.find();
  res.render("publicLists", { Lists });
};

const addList = async (req, res, next) => {
  try {
    await Wishlist.create({
      ...req.body,
      createdBy: req.user._id,
    });
    req.flash("info", "item created.");
    res.redirect("/wishlist");
  } catch (e) {
    if (e.name === "ValidationError") {
      parseVErr(e, req);
      return res.render("item", { item: null });
    }
    next(e);
  }
};

const deleteList = async (req, res, next) => {
  await Wishlist.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  req.flash("info", "Item deleted.");
  res.redirect("/wishlist");
};

module.exports = {
  getAllLists,
  addList,
  deleteList
};
