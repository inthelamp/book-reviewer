const Joi = require("joi");

const { v4: uuid } = require("uuid");
const User  = require("../models/user");
const Review  = require("../models/review");

//Validate user schema
const reviewSchema = Joi.object().keys({
  content: Joi.required(),
  title: Joi.string(),
  status: Joi.string()
});

module.exports.Post = async (req, res) => {
  try {
    const result = reviewSchema.validate(req.body);
    const userId = req.decoded.id;

    if (result.error) {
        console.log(result.error.message);
        return res.json({
            error: true,
            status: 400,
            message: result.error.message,
        });
    }

    const id = uuid(); //Generate unique id for the user.
    result.value.reviewId = id;
    result.value.userId = userId    

    const newReview = new Review.Model(result.value);
    await newReview.save();

    return res.status(200).json({
      success: true,
      message: "Review is successfully saved.",
    });
  } catch (error) {
    console.error("Review save error", error);

    return res.status(500).json({
      error: true,
      message: "Saving review is failed.",
    });
  }
};
