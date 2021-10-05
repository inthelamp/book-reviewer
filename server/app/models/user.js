const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * User statuses
 * @enum {string}
 */
const Statuses = {
	ACTIVE: "Active",
	INACTIVE: "Inactive",
	SUSPENDED: "Suspended"
};


/**
 * User roles
 * @enum {string}
 */
const Roles = {
	ADMIN: "Admin",
	USER: "User"
};

const userSchema = new Schema(
  {
    userId: { type: String, unique: true, required: true },
    userName: { type: String, required: true },    
    email: { type: String,  unique: true, required: true },
    status: {
      type: String,
      default: Statuses.INACTIVE,
      enum: Statuses
    },  
    role: {
      type: String,
      default: Roles.USER,
      enum: Roles
    },     
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },    
    accessToken: { type: String, default: null },
  },
  { timestamps: true }
);

const Model = mongoose.model("user", userSchema);

module.exports = { Statuses, Roles, Model };

module.exports.hashPassword = async (inputPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(inputPassword, salt);
  } catch (error) {
    throw new Error("Hashing process is failed.", error);
  }
};

module.exports.verifyPassword = async (inputPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    throw new Error("Verification process is failed.", error);
  }
};