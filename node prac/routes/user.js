const express = require("express");
const router = express.Router();
const user = require("../models/users")
const {setUser,getAllUser,getUser,updateUser,deleteUser} = require("../controllers/users")

router.route("/").post(setUser).get(getAllUser);

router.route("/:id")
.get(getUser)
.patch(updateUser)
.delete(deleteUser)

module.exports = router;