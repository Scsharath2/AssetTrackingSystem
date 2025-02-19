const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ GET ServiceNow URL
router.get("/", async (req, res) => {
  try {
    const config = await pool.query("SELECT service_now_url FROM configuration LIMIT 1");
    if (config.rows.length === 0) {
      return res.status(404).json({ error: "ServiceNow URL not configured" });
    }
    res.json(config.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ UPDATE or INSERT ServiceNow URL
router.post("/", async (req, res) => {
  try {
    const { service_now_url } = req.body;

    if (!service_now_url) {
      return res.status(400).json({ error: "ServiceNow URL is required" });
    }

    // Check if a record already exists
    const existingConfig = await pool.query("SELECT * FROM configuration LIMIT 1");

    let result;
    if (existingConfig.rows.length > 0) {
      // Update existing URL
      result = await pool.query("UPDATE configuration SET service_now_url = $1 RETURNING *", [service_now_url]);
    } else {
      // Insert new URL
      result = await pool.query("INSERT INTO configuration (service_now_url) VALUES ($1) RETURNING *", [service_now_url]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
