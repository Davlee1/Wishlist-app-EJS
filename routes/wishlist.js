const express = require("express");
const router = express.Router();

const {
  getAllItems,
  showNewForm,
  createItem,
  showEditForm,
  updateItem,
  deleteItem,
} = require("../controllers/wishlist");


//GET /wishlist (display all the items belonging to this user)
router.get("/",getAllItems);
//POST /wishlist (Add a new item listing)
router.post("/", createItem);
//GET /wishlist/new (Put up the form to create a new item)
router.get("/new", showNewForm);
//GET /wishlist/edit/:id (Get a particular item and show it in the edit box)
router.get("/edit/:id", showEditForm);
//POST /wishlist/update/:id (Update a particular item)
router.post("/update/:id", updateItem);
//POST /wishlist/delete/:id (Delete an item)
router.post("/delete/:id", deleteItem);

module.exports = router;
