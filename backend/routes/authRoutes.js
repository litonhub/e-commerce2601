const express = require("express");
const router = express.Router();
const { registrationController } = require("../controllers/authControllers");


router.post("/register", registrationController);


module.exports = router;