const PublicLists = require("../models/publicLists");
const parseVErr = require("../utils/parseValidationErrs");

const getAllLists = async (req, res) => {
  const Lists = await PublicLists.find();
  res.render("publicLists", { Lists });
};

const addList = async (req, res, next) => {
  try {
    await PublicLists.create({
      ...req.body,
      name: req.params.user,
      id: req.params.id,
    });
    req.flash("info", "List published.");
    res.redirect("/wishlist");
    
  } catch (e) {
    if (e.name === "ValidationError") {
      parseVErr(e, req);
      res.redirect("/wishlist");
    }
    next(e);
  }
};

const deleteList = async (req, res, next) => {
  try {
  const UserId = req.params.id;
  await PublicLists.findOneAndDelete({
    id: UserId
  });
  req.flash("info", "List un-published");
  res.redirect("/wishlist");
    } catch (e) {
    if (e.name === "ValidationError") {
      parseVErr(e, req);
      res.redirect("/wishlist");
    }
    next(e);
  }
};

module.exports = {
  getAllLists,
  addList,
  deleteList
};
