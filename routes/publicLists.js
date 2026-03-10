const express = require("express");
const router = express.Router();


const {
  getAllLists,
  addList,
  deleteList
} = require("../controllers/publicLists.js");


//GET /wishlist (display all the items belonging to this user)
router.get("/",auth, getAllLists);

//POST /wishlist (Add a new item listing)
router.post("/", addList);

//POST /wishlist/delete/:id (Delete an item)
router.post("/delete/:id", deleteList);


module.exports = router;