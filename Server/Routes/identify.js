const express = require("express");
const router = express.Router();
const controller = require("../Controllers/controller");

router.post("/identify", controller.handleRequest);

module.exports = router;
