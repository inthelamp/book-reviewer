const Joi = require("joi");

const { v4: uuid } = require("uuid");
const { sendEmail } = require("../middlewares/mailer");
const { generateJwt } = require("../middlewares/generateJwt");
const User  = require("../models/user");

// Validating user data from client
const userSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  userName: Joi.string().required().min(3),
  password: Joi.string().required().min(8),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

/**
 * Signing up user
 */
module.exports.Signup = async (req, res) => {
  try {
    const result = userSchema.validate(req.body);

    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    // Checking if email has been already registered
    var user = await User.Model.findOne({
      email: result.value.email,
    }).setOptions({ sanitizeFilter: true });

    if (user) {
      return res.json({
        error: true,
        message: "Email is already in use.",
      });
    }

    const hash = await User.hashPassword(result.value.password);
    const id = uuid(); // Generating unique id for user
    result.value.userId = id;

    delete result.value.confirmPassword;

    result.value.password = hash;
    let code = Math.floor(100000 + Math.random() * 900000);  // Generating random 6 digit code     
    
    require("dotenv").config();
    let expiry = Date.now() + 60 * 1000 * process.env.EMAIL_TOKEN_EXPIRE_IN;  // Setting expiry time from now

    // Uncomment these statements for email verification
    /* const sendCode = await sendEmail(result.value.email, code);

    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    } */

    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);
    result.value.status = User.Statuses.INACTIVE;
    result.value.role = User.Roles.USER;
    
    const newUser = new User.Model(result.value);
    await newUser.save();   // Saving user information

    return res.status(200).json({
      success: true,
      message: "Sign-up is successfully completed.",
    });
  } catch (error) {
    console.error("Sign-up error", error);

    return res.status(500).json({
      error: true,
      message: "Sign-up is failed.",
    });
  }
};

/**
 * Signing in user
 * @returns retrun a token generated as well
 */
module.exports.Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Please enter email and password.",
      });
    }

    const user = await User.Model.findOne({ email: email });

    // making an error if user is not activated
    if (!user || user.status === User.Statuses.INACTIVE) {
      return res.status(404).json({
        error: true,
        message: "No active account is found.",
      });
    }

    // Preventing suspended user from accessing
    if (user.status === User.Statuses.SUSPENDED) {
      return res.status(400).json({
        error: true,
        message: "Your account is suspended.",
      });
    }

    // Checking if given password is the right one or not
    const isValid = await User.verifyPassword(password, user.password);

    if (!isValid) {
      //Failed
      return res.status(400).json({
        error: true,
        message: "Please enter right email and password.",
      });        
    }

    // Generating a token based on user information
    const { error, token } = await generateJwt(user.userId, user.userName, user.role);

    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later.",
      });
    }

    user.accessToken = token;

    await user.save(); // Saving token into DB

    //Success
    return res.send({
      success: true,
      message: "User is signed in successfully.",
      accessToken: token,
     });
  } catch (err) {
    console.error("Sign-in error", err);

    return res.status(500).json({
      error: true,
      message: "Couldn't sign in. Please try again later.",
    });
  }
};

/**
 * Activating user
 */
module.exports.Activate = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Checking if email and code are provided
    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: "Some information is not provided. email: " + email + " code: " + code,        
      });
    }

    // Retriving user based on email, code and email token
    const user = await User.Model.findOne({
      email: email,
      emailToken: code,
      emailTokenExpires: { $gt: Date.now() },
    });

    // Making an error if not found
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Activation is failed.",        
      });      
    } else {
      //Making an error if the token was used before
      if (user.status === User.Statuses.ACTIVE)  
        return res.send({
          error: true,
          message: "Account is already activated.",
          status: 400,
      });

      user.emailToken = "";
      user.emailTokenExpires = null;
      user.status = User.Statuses.ACTIVE;

      await user.save();  // Updating user information in DB

      return res.status(200).json({
        success: true,
        message: "Account is successfully activated.",
      });
    }
  } catch (error) {
    console.error("Activation error", error);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

/**
 * Dealing with a request for forgetting password 
 */
module.exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.send({
        status: 400,
        error: true,
        message: "Email address is required.",
      });
    }

    const user = await User.Model.findOne({
      email: email,
    });

    if (!user) {
      return res.send({
        success: true,
        message: "Please enter your login email address.",
      });
    }

    let code = Math.floor(100000 + Math.random() * 900000); // Generating random 6 digit code 

    // Uncomment these statements for email verification
    /* let response = await sendEmail(user.email, code);

    if (response.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send mail. Please try again later.",
      });
    } */

    require("dotenv").config();
    let expiry = Date.now() + 60 * 1000 * process.env.EMAIL_TOKEN_EXPIRE_IN; // Computing expiry time
    user.resetPasswordToken = code;
    user.resetPasswordExpires = expiry;

    await user.save(); // Updating user information in DB

    return res.send({
      success: true,
      message: "Verification email has been sent. If you don't have the email, please try it again.",
    });
  } catch (error) {
    console.error("Forgot password error", error);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
 };

/**
 * Dealing with a request for resetting password 
 */
 module.exports.ResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Checking if email token which is a code sent by email, new password and confirm password are provided
    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        error: true,
        message: "Some information is missing.",
      });
    }

    // Retriving user based on the token
    const user = await User.Model.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // Making an error if not found
    if (!user) {
      return res.send({
        error: true,
        message: "Password reset code is invalid or has been expired.",
      });
    }

    // Checking if new password is identical with confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Passwords are mismatched.",
      });
    }
    
    // Creating hash
    const hash = await User.hashPassword(req.body.newPassword);

    user.password = hash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = "";

    await user.save(); // Saving new password into DB

    return res.send({
      success: true,
      message: "Password has been successfully changed.",
    });
  } catch (error) {
    console.error("Reset password error", error);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

/**
 * Signing out user
 */
module.exports.Signout = async (req, res) => {
  try {
    const { id } = req.decoded; // Passed by verifyJwt, a middleware 

    // Retriving user based on id
    let user = await User.Model.findOne({ userId: id });

    user.accessToken = "";
    
    await user.save(); // Removing sign-in token in DB

    return res.send({
      success: true, 
      message: "User is signed out sucessfully.",
    });
  } catch (error) {
    console.error("Sign-out error", error);

    return res.stat(500).json({
      error: true,
      message: error.message,
    });
  }
};