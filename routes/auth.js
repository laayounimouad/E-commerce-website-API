const express = require("express");
const router = express.Router();

//middlewares
const { authCheck } = require("../middlewares/auth");

//controller
const { createOrUpdateUser } = require("../controllers/auth");

//route
router.post("/create-or-update-user", authCheck, createOrUpdateUser);

module.exports = router;
