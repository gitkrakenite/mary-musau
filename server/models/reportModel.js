const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const likeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // fixer: {
    //   type: String,
    // },
    location: {
      type: String,
      default: "campus",
    },
    resolved: {
      type: Boolean,
      default: false,
    },

    comments: [commentSchema],
    likes: [likeSchema],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
