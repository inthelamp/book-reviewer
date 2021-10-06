const jwt = require("jsonwebtoken");
require("dotenv").config();

const options = {
  expiresIn: process.env.SIGNIN_TOKEN_EXPIRE_IN, // Setting token expiry time
};

/**
 * Generating a token containing id, name, and role
 * @param {string} userId - user unique id
 * @param {string} userName - user name
 * @param {string} role - user role
 * @returns {boolean, string} {error, token}
 */
exports.generateJwt = async (userId, userName, role) => {
  try {
    const payload = { 
                      id: userId,
                      name: userName,
                      role: role
                    };
                    
    const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
    
    return { error: false, token: token };
  } catch (error) {
    return { error: true };
  }
}