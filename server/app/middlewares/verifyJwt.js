const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/user");

/**
 * Verifying token
 */
exports.verifyJwt = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const id = req.headers.userid;

  let result;

  // Checking if the auth string is provided
  if (!authorizationHeader) {
    return res.status(401).json({
      error: true,
      message: "Access token is missing",
    });
  }
   
  // Getting token from the auth string
  const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
  const options = {
    expiresIn: process.env.SIGNIN_TOKEN_EXPIRE_IN,
  };

  try {

    // Retriving user with the token
    let user = await User.Model.findOne({
      accessToken: token,
    });

    // Making an error if not found
    if (!user || user.userId !== id ) {
      result = {
        error: true,
        message: "Authorization error",
      };
      return res.status(403).json(result);
    }

    // verifying token with the secret word
    result = jwt.verify(token, process.env.JWT_SECRET, options);

    // Checking if token from client is valid or not
    if (user.userId !== result.id) {
      result = {
        error: true,
        message: "Invalid token",
      };
      return res.status(401).json(result);
    }
        
    req.decoded = result;
    
    next();
  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      result = {
        error: true,
        message: "Expired token",
      };
    } else {
      result = {
        error: true,
        message: "Authentication error",
      };
    }
    return res.status(403).json(result);
  }
}