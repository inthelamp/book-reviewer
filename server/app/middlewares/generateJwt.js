const jwt = require("jsonwebtoken");

require("dotenv").config();

const options = {
  expiresIn: process.env.TOKEN_EXPIRE_IN,
};

async function generateJwt(userId, userName, role) {
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

module.exports = { generateJwt };