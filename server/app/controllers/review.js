const Joi = require("joi");

const { v4: uuid } = require("uuid");
const Review  = require("../models/review");

// Validating review data from client
const reviewSchema = Joi.object().keys({
  content: Joi.required(),
  subject: Joi.string(),
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

/**
 * Getting all my reviews
 * @returns {json} retrun a JSON object
 */
 module.exports.MyReviews = async (req, res) => {
  try {
    const { id } = req.decoded; // Passed by verifyJwt, a middleware 

    // Retriving all reviews based on id
    let reviews = await Review.Model.find({ userId: id }, { reviewId: 1, subject: 1, status: 1, isOwner: { $toBool: true }, _id: 0 });

    return res.status(200).json({
      success: true,
      reviews,
      message: "My reviews are successfully retrieved.",
    });
  } catch (error) {
    console.error("My reviews error", error);

    return res.status(500).json({
      error: true,
      message: "Getting my reviews is failed.",
    });
  }
};

/**
 * Getting all reviews not posted by the user
 * @returns {json} retrun a JSON object
 */
 module.exports.Reviews = async (req, res) => {
  try {    
    const id = req.headers.userid;

    // Retriving all reviews based on id
    let reviews = await Review.Model.find({ userId: {$ne: id}}, { reviewId: 1, subject: 1, status: 1, isOwner: { $toBool: false }, _id: 0 });

    return res.status(200).json({
      success: true,
      reviews,
      message: "Reviews are successfully retrieved.",
    });
  } catch (error) {
    console.error("Reviews error", error);

    return res.status(500).json({
      error: true,
      message: "Getting other reviews is failed.",
    });
  }
};

/**
 * Getting all reviews not posted by a user if the user is signed in
 * @returns {json} retrun a JSON object
 */
 module.exports.Review = async (req, res) => {
  try {    
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Review id is not provided."
      });
    }

    // Retriving all reviews based on id
    let detail = await Review.Model.findOne({ reviewId: id }, { reviewId: 0, subject: 0, status: 0, _id: 0 });

    if (!detail) {
      return res.json({
        error: true,
        message: "Review id is invalid."
      });
    }

    return res.status(200).json({
      success: true,
      detail,
      message: "Review is successfully retrieved.",
    });
  } catch (error) {
    console.error("Detail error", error);

    return res.status(500).json({
      error: true,
      message: "Getting detail is failed.",
    });
  }
};