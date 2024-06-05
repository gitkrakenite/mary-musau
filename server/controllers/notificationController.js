const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// create notification
const createNotification = async (req, res) => {
  const { sender, receiver, message, referID } = req.body;

  if (!sender || !receiver || !message || !referID) {
    res.status(404).send("Details missing");
    return;
  }

  try {
    const notification = await Notification.create({
      sender,
      receiver,
      message,
      referID,
    });

    if (notification) {
      res.status(201).send(notification);
      return;
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

const fetchAllNotifications = async (req, res, next) => {
  try {
    const notification = await Notification.find().sort({ $natural: -1 });
    res.status(200).send(notification);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const fetchAllMyNotifications = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(500).send("email not sent");
  }
  try {
    const notification = await Notification.find({ receiver: email });
    res.status(200).send(notification);
  } catch (error) {
    res.status(500).send("Action Failed");
  }
};

const deleteNotification = async (req, res, next) => {
  // check if notification exist
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(400).json({ message: "notification not found" });
    return;
  }

  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: "Could not delete notification" });
  }
  // console.log(req.params);
};

// const fetchSpecificReport = async (req, res) => {
//   try {
//     const report = await Report.findOne({ _id: req.params.id });
//     res.status(200).send(report);
//   } catch (error) {
//     res.status(500).send("Action Failed");
//   }
// };

const deleteAllNotifications = async (req, res, next) => {
  try {
    // Delete all notificayions
    await Notification.deleteMany({});
    res.json({ message: "All notifications have been deleted." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting notifications." });
  }
};

module.exports = {
  createNotification,
  fetchAllNotifications,
  deleteNotification,
  fetchAllMyNotifications,
  deleteAllNotifications,
};
