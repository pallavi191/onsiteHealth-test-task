const express = require("express");
const app = express();
const cors = require("cors");

// load env variables
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
    path: path.join(__dirname, "local.env")
});

// connect to db
const connectDB = require("./config/db")
connectDB();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api", require("./routes"))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
