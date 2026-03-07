const express = require("express");
const router = express.Router();
const auth = require("./middleware/auth");

const {
  getAllItems,
  showNewForm,
  createItem,
  showEditForm,
  updateItem,
  deleteItem,
  shareWishlist
} = require("../controllers/wishlist");


//GET /wishlist (display all the items belonging to this user)
router.get("/",auth, getAllItems);

//POST /wishlist (Add a new item listing)
router.post("/",auth, createItem);

//GET /wishlist/new (Put up the form to create a new item)
router.get("/new", auth, showNewForm);

//GET /wishlist/edit/:id (Get a particular item and show it in the edit box)
router.get("/edit/:id", auth, showEditForm);

//POST /wishlist/update/:id (Update a particular item)
router.post("/update/:id", auth, updateItem);

//POST /wishlist/delete/:id (Delete an item)
router.post("/delete/:id", auth, deleteItem);

//GET /wishlist/share/:id (Publicly share wishlist)
router.get("/share/:id", shareWishlist);

module.exports = router;
