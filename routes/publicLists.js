const express = require("express");
const router = express.Router();


const {
  getAllLists,
  addList,
  deleteList
} = require("../controllers/publicLists.js");


//GET /publicLists (display all the List that have been published)
router.get("/", getAllLists);

//POST /publicLists (Add a new list)
router.post("/add/:user/:id", addList);

//POST /publicLists/delete (Delete a list)
router.post("/delete/:id", deleteList);


module.exports = router;