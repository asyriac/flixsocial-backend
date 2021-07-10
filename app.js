const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// body parser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser setup
app.use(cookieParser());

// cors setup
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_APP_URL],
    optionsSuccessStatus: 200,
  })
);

// DB setup
const initDB = require("./db");
initDB();

// Routes setup
const routes = require("./routes/v1.route");
app.use("/api/v1", routes);

// Handle unhandled routes
app.all("*", (req, res) => res.status(404).json({ message: `${req.originalUrl} not found` }));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
