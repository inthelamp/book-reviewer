const express = require("express");
const router = express.Router();

const { verifyJwt } = require("../middlewares/verifyJwt");
const user = require("../controllers/user");

router.post('/signup', function (req, res) {
    user.Signup(req, res);
});

router.post('/signin', function (req, res) {
    user.Signin(req, res);
});

router.patch('/activate', function (req, res) {
    user.Activate(req, res);
});

router.patch('/forgot', function (req, res) {
    user.ForgotPassword(req, res);
});

router.patch('/reset', function (req, res) {
    user.ResetPassword(req, res);
});

router.get("/signout", verifyJwt, user.Signout);

module.exports = router;