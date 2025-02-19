const express = require("express");
const cors = require("cors");
const pool = require("./db"); // PostgreSQL connection
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // ✅ This line is required to parse JSON

const modelRoutes = require("./routes/models");
const locationRoutes = require("./routes/locations");
const employeeRoutes = require("./routes/employees");
const stockRoutes = require("./routes/stocks");
const assetRoutes = require("./routes/assets");
const scheduleRoutes = require("./routes/schedules");
app.use("/api/models", modelRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/schedules", scheduleRoutes);
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
