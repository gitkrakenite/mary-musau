const express = require("express");
const router = express.Router();

const {
  createNotification,
  fetchAllNotifications,
  deleteNotification,
  fetchAllMyNotifications,
  deleteAllNotifications,
} = require("../controllers/notificationController");

// baseUrl => /notify/
router.post("/create", createNotification); //create notifications
router.get("/all", fetchAllNotifications); // see all notifications
router.delete("/delete/:id", deleteNotification); // delete notifications
router.post("/mine", fetchAllMyNotifications); //my notifications
router.delete("/", deleteAllNotifications); //delete all notifications

module.exports = router;
