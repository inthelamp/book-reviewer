const Joi = require("joi");

const { v4: uuid } = require("uuid");
const Review  = require("../models/review");

// Validating review data from client
const reviewSchema = Joi.object().keys({
  content: Joi.required(),
  title: Joi.string(),
  status: Joi.string()
});

/**
 * Saving review
 * @returns {json} retrun a JSON object
 */
module.exports.Publish = async (req, res) => {
  try {
    const result = reviewSchema.validate(req.body);
    const userId = req.decoded.id; // Passed by verifyJwt, a middleware 

    if (result.error) {
        console.log(result.error.message);
        return res.json({
            error: true,
            status: 400,
            message: result.error.message,
        });
    }

    const id = uuid(); // Generating unique id for the user.
    result.value.reviewId = id;
    result.value.userId = userId    

    const newReview = new Review.Model(result.value);
    await newReview.save(); // Saving into DB

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
