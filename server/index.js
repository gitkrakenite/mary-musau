const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv").config();

const connectDB = require("./config/db");
const userRouter = require("./routes/useRoutes");
const reportRouter = require("./routes/reportRoutes");
const notifyRouter = require("./routes/notificationRoute");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.get("/", (req, res) => res.status(200).send("API WORKING WELL"));
// DB connection
connectDB();

app.use("/api/v1/users", userRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/notify", notifyRouter);

// listener
app.listen(PORT, console.log(`Server running on port: ${PORT}`));
