const express = require("express");
const router = express.Router();

const { verifyJwt } = require("../middlewares/verifyJwt");
const review = require("../controllers/review");

router.post("/publish", verifyJwt, review.Publish);

module.exports = router;