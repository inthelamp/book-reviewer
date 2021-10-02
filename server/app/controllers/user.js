const Joi = require("joi");

const { v4: uuid } = require("uuid");
const { sendEmail } = require("../middlewares/mailer");
const { generateJwt } = require("../middlewares/generateJwt");
const User  = require("../models/user");

//Validate user schema
const userSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }),
  userName: Joi.string().required().min(3),
  password: Joi.string().required().min(8),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

exports.Signup = async (req, res) => {
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

    //Check if the email has been already registered.
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
    const id = uuid(); //Generate unique id for the user.
    result.value.userId = id;

    delete result.value.confirmPassword;

    result.value.password = hash;
    let code = Math.floor(100000 + Math.random() * 900000);  //Generate random 6 digit code.                             
    let expiry = Date.now() + 60 * 1000 * 15;  //Set expiry 15 mins ahead from now

    // Uncomment these statements for email verification
    // const sendCode = await sendEmail(result.value.email, code);

    // if (sendCode.error) {
    //   return res.status(500).json({
    //     error: true,
    //     message: "Couldn't send verification email.",
    //   });
    // }

    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);
    result.value.status = User.Statuses.INACTIVE;
    result.value.role = User.Roles.USER;
    
    const newuser = new User.Model(result.value);
    await newuser.save();

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

exports.Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Please enter email and password.",
      });
    }

    const user = await User.Model.findOne({ email: email });

    if (!user || user.status === User.Statuses.INACTIVE) {
      return res.status(404).json({
        error: true,
        message: "No active account is found.",
      });
    }

    if (user.status === User.Statuses.SUSPENDED) {
      return res.status(400).json({
        error: true,
        message: "Your account is suspended.",
      });
    }

    const isValid = await User.verifyPassword(password, user.password);

    if (!isValid) {
      //Failed
      return res.status(400).json({
        error: true,
        message: "Please enter right email and password.",
      });        
    }

    const { error, token } = await generateJwt(user.userId, user.userName, user.role);

    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later.",
      });
    }

    user.accessToken = token;

    await user.save();

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

exports.Activate = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: "Some information is not provided. email: " + email + " code: " + code,        
      });
    }

    const user = await User.Model.findOne({
      email: email,
      emailToken: code,
      emailTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Activation is failed.",        
      });      
    } else {
      if (user.status === User.Statuses.ACTIVE)
        return res.send({
          error: true,
          message: "Account is already activated.",
          status: 400,
        });

      user.emailToken = "";
      user.emailTokenExpires = null;
      user.status = User.Statuses.ACTIVE;

      await user.save();

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

exports.ForgotPassword = async (req, res) => {
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

    let code = Math.floor(100000 + Math.random() * 900000);
    // let response = await sendEmail(user.email, code);

    // if (response.error) {
    //   return res.status(500).json({
    //     error: true,
    //     message: "Couldn't send mail. Please try again later.",
    //   });
    // }

    let expiry = Date.now() + 60 * 1000 * 15;
    user.resetPasswordToken = code;
    user.resetPasswordExpires = expiry; // 15 minutes

    await user.save();

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


 exports.ResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        error: true,
        message: "Some information is missed.",
      });
    }

    const user = await User.Model.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send({
        error: true,
        message: "Password reset code is invalid or has been expired.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Passwords are mismatched.",
      });
    }
    
    const hash = await User.hashPassword(req.body.newPassword);

    user.password = hash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = "";

    await user.save();

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

exports.Signout = async (req, res) => {
  try {
    const { id } = req.decoded;

    let user = await User.Model.findOne({ userId: id });

    user.accessToken = "";
    
    await user.save();

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