const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/reportController");

// baseUrl => /report/
router.post("/create", createReport); //create report

router.put("/edit/:id", updateSpecificReport); // edit report
router.get("/all", fetchAllReports); // see all reports
router.delete("/delete/:id", deleteReport); // delete report
router.get("/specific/:id", fetchSpecificReport); //specific report
router.post("/mine", fetchAllMyReports); //my reports
router.post("/comment/:id", commentOnReport); //comment on report
// Delete comment on report
router.delete("/comment/:id/:commentId", deleteCommentOnReport);
router.post("/like/:id", likeReport); //like report

router.post("/cat", fetchReportBasedOnSth); // fetch cat report
router.post("/resolved", fetchResolvedReports); //resolved report
router.delete("/", deleteAllReports); //delete all reports

module.exports = router;
