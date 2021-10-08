const express = require("express");
const router = express.Router();

const { verifyJwt } = require("../middlewares/verifyJwt");
const review = require("../controllers/review");

router.post("/publish", verifyJwt, review.Publish);
router.get("/myreviews", verifyJwt, review.MyReviews);
router.get("/reviews", function (req, res) {
    review.Reviews(req, res);
});
router.get("/reviews/:id", function (req, res) {
    review.Review(req, res);
});

module.exports = router;