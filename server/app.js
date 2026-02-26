const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const roomRoutes = require("./routes/room.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy.",
    data: {},
  });
});

app.use("/api/rooms", roomRoutes);
app.use(errorHandler);

module.exports = app;
