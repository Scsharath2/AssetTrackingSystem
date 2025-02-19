// routes/location.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create a new location
router.post("/", async (req, res) => {
  try {
    const { location_name, location_full_name, address, city, country, region, location_type, building, floor_wing } = req.body;
    const newLocation = await pool.query(
      "INSERT INTO locations (location_name, location_full_name, address, city, country, region, location_type, building, floor_wing) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
      [location_name, location_full_name, address, city, country, region, location_type, building, floor_wing]
    );
    res.json(newLocation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read all locations with count
router.get("/", async (req, res) => {
  try {
    const allLocations = await pool.query("SELECT * FROM locations");
    const count = await pool.query("SELECT COUNT(*) FROM locations");
    res.json({ count: count.rows[0].count, data: allLocations.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read a single location by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const location = await pool.query("SELECT * FROM locations WHERE location_id = $1", [id]);
    if (location.rows.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a location by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { location_name, location_full_name, address, city, country, region, location_type, building, floor_wing } = req.body;
    const updatedLocation = await pool.query(
      "UPDATE locations SET location_name = $1, location_full_name = $2, address = $3, city = $4, country = $5, region = $6, location_type = $7, building = $8, floor_wing = $9 WHERE location_id = $10 RETURNING *",
      [location_name, location_full_name, address, city, country, region, location_type, building, floor_wing, id]
    );
    if (updatedLocation.rows.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(updatedLocation.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a location by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLocation = await pool.query("DELETE FROM locations WHERE location_id = $1 RETURNING *", [id]);
    if (deletedLocation.rows.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json({ message: "Location deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
