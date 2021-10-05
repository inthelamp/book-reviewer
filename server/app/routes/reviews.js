const express = require("express");
const router = express.Router();

const { verifyJwt } = require("../middlewares/verifyJwt");
const review = require("../controllers/review");

router.post("/post", verifyJwt, review.Post);

module.exports = router;