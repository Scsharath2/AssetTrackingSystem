const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create a new asset
router.post("/", async (req, res) => {
  try {
    const { model_id, location_id, stock_id, employee_id, asset_tag, barcode, serial_number, sys_id, purchase_date, po_number, cost_type, assignment, status, responsible_team, purpose } = req.body;
    const newAsset = await pool.query(
      "INSERT INTO assets (model_id, location_id, stock_id, employee_id, asset_tag, barcode, serial_number, sys_id, purchase_date, po_number, cost_type, assignment, status, responsible_team, purpose) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *",
      [model_id, location_id, stock_id, employee_id, asset_tag, barcode, serial_number, sys_id, purchase_date, po_number, cost_type, assignment, status, responsible_team, purpose]
    );
    res.json(newAsset.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read all assets with count
router.get("/", async (req, res) => {
  try {
    const allAssets = await pool.query("SELECT * FROM assets");
    const count = await pool.query("SELECT COUNT(*) FROM assets");
    res.json({ count: count.rows[0].count, data: allAssets.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read a single asset by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await pool.query("SELECT * FROM assets WHERE asset_id = $1", [id]);
    if (asset.rows.length === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(asset.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an asset by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { model_id, location_id, stock_id, employee_id, asset_tag, barcode, serial_number, sys_id, purchase_date, po_number, cost_type, assignment, status, responsible_team, purpose } = req.body;
    const updatedAsset = await pool.query(
      "UPDATE assets SET model_id = $1, location_id = $2, stock_id = $3, employee_id = $4, asset_tag = $5, barcode = $6, serial_number = $7, sys_id = $8, purchase_date = $9, po_number = $10, cost_type = $11, assignment = $12, status = $13, responsible_team = $14, purpose = $15 WHERE asset_id = $16 RETURNING *",
      [model_id, location_id, stock_id, employee_id, asset_tag, barcode, serial_number, sys_id, purchase_date, po_number, cost_type, assignment, status, responsible_team, purpose, id]
    );
    if (updatedAsset.rows.length === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(updatedAsset.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an asset by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAsset = await pool.query("DELETE FROM assets WHERE asset_id = $1 RETURNING *", [id]);
    if (deletedAsset.rows.length === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
