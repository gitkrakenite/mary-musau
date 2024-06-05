const Report = require("../models/reportModel");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");

// create report
const createReport = async (req, res) => {
  const { title, description, category, photo, creator, location } = req.body;

  if (!title || !photo || !creator || !description) {
    res.status(404).send("Details missing");
    return;
  }

  // upload profile photo to cloudinary
  const result = await cloudinary.uploader.upload(photo, {
    folder: "reports",
  });

  if (!result) {
    res.status(400).json({ error: "Failed To Upload Photo" });
    return;
  }

  try {
    const report = await Report.create({
      title,
      description,
      photo: result.secure_url,
      category,
      creator,
      location,
    });

    if (report) {
      res.status(201).send(report);
      return;
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

const fetchAllReports = async (req, res, next) => {
  try {
    const report = await Report.find().sort({ $natural: -1 });
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteReport = async (req, res, next) => {
  // check if report exist
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(400).json({ message: "report not found" });
    return;
  }

  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: "Could not delete report" });
  }
  // console.log(req.params);
};

const fetchReportBasedOnSth = async (req, res) => {
  const { category } = req.body;
  try {
    const report = await Report.find({
      category,
    });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).send(error);
  }
};

const fetchResolvedReports = async (req, res) => {
  const { resolved } = req.body;
  try {
    const report = await Report.find({
      resolved,
    });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).send(error);
  }
};

const commentOnReport = async (req, res) => {
  try {
    const { email, comment } = req.body;

    // Find the post by ID
    const report = await Report.findById(req.params.id);

    // find if the user exists
    const user = await User.findOne({ email });

    // If the post doesn't exist, return an error
    if (!report) {
      return res.status(404).json({ error: "report not found" });
    }

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    // Create a new comment
    const newComment = {
      email,
      comment,
    };

    // Add the comment to the post's comments array
    report.comments.push(newComment);

    // Save the updated post with the new comment
    await report.save();
    res.status(201).send(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed To Comment" });
  }
};

const deleteCommentOnReport = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find the post by ID
    const report = await Report.findById(req.params.id);

    // If the post doesn't exist, return an error
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Find the index of the comment in the comments array
    const commentIndex = report.comments.findIndex(
      (comment) => comment._id == commentId
    );

    // If the comment doesn't exist, return an error
    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Remove the comment from the comments array
    report.comments.splice(commentIndex, 1);

    // Save the updated post without the deleted comment
    await report.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

const likeReport = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the report item by ID
    const report = await Report.findById(req.params.id);

    // If the report doesn't exist, return an error
    if (!report) {
      return res.status(404).json({ error: "report not found" });
    }

    // Find if the username exists
    const user = await User.findOne({ email });
    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has already liked this report
    const hasLiked = report.likes.some((like) => like.email === email);

    if (hasLiked) {
      // If the user has already liked it, remove their like
      report.likes = report.likes.filter((like) => like.email !== email);
      await report.save();
      res.status(200).json({ message: "Unliked successfully" });
    } else {
      // If the user hasn't liked it yet, add their like
      const newLike = {
        email,
      };
      report.likes.push(newLike);
      await report.save();
      res.status(201).json({ message: "Liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed To Like" });
  }
};

const fetchSpecificReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id });
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send("Action Failed");
  }
};

const fetchAllMyReports = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(500).send("ID not sent");
  }

  try {
    const report = await Report.findOne({ creator: email });
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send("Action Failed");
  }
};

const updateSpecificReport = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteAllReports = async (req, res, next) => {
  try {
    // Delete all reports
    await Report.deleteMany({});
    res.json({ message: "All reports have been deleted." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting reports." });
  }
};

module.exports = {
  createReport,
  fetchAllReports,
  likeReport,
  fetchReportBasedOnSth,
  deleteReport,
  commentOnReport,
  fetchSpecificReport,
  updateSpecificReport,
  fetchResolvedReports,
  deleteAllReports,
  fetchAllMyReports,
  deleteCommentOnReport,
};
