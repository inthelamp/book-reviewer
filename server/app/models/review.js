const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Review statuses
 * @enum {string}
 */
 const Statuses = {
	DRAFT: "Draft",
	PUBLISHED: "Published",    
	INACTIVE: "Inactive"
};

// Review schema
const reviewSchema = new Schema(
  {
    reviewId: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    subject: { type: String },    
    bookTitle: { type: String },
    bookAuthors: { 
       firstAuthor: { type: String },
       secondAuthor: { type: String },
       thirdAuthor: { type: String },
    },
    isbn: { type: String },
    bookCoverImage: {  
        data: Buffer,
        contentType: String
    },
    images : [
      {
        subject: { type: String },
        image: {  
            data: Buffer,
            contentType: String,
        },
      },
    ],
    content: { type: Array, required: true },
    status: {
      type: String,
      default: Statuses.DRAFT,
      enum: Statuses
    },     
  },
  { timestamps: true }
);

const Model = mongoose.model("review", reviewSchema);

module.exports = { Statuses, Model };