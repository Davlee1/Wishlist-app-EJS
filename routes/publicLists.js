const express = require("express");
const router = express.Router();


const {
  getAllLists,
  addList,
  deleteList
} = require("../controllers/publicLists.js");


//GET /wishlist (display all the List that have been published)
router.get("/",auth, getAllLists);

//POST /wishlist (Add a new list)
router.post("/", addList);

//POST /wishlist/delete/:id (Delete a list)
router.post("/delete/:id", deleteList);


module.exports = router;