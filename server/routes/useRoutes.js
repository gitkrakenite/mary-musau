const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
  allUsers,
  checkIfUserAlreadyExists,
  updateMyAccount,
  deleteUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", allUsers);
router.post("/check", checkIfUserAlreadyExists);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

router.put("/update/:id", updateMyAccount);

module.exports = router;
