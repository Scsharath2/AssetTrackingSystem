const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create a new stock
router.post("/", async (req, res) => {
  try {
    const { location_id, employee_id, stock_name, stock_full_name, stock_type } = req.body;
    const newStock = await pool.query(
      "INSERT INTO stocks (location_id, employee_id, stock_name, stock_full_name, stock_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [location_id, employee_id, stock_name, stock_full_name, stock_type]
    );
    res.json(newStock.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read all stocks with count
router.get("/", async (req, res) => {
  try {
    const allStocks = await pool.query("SELECT * FROM stocks");
    const count = await pool.query("SELECT COUNT(*) FROM stocks");
    res.json({ count: count.rows[0].count, data: allStocks.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read a single stock by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await pool.query("SELECT * FROM stocks WHERE stock_id = $1", [id]);
    if (stock.rows.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }
    res.json(stock.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a stock by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { location_id, employee_id, stock_name, stock_full_name, stock_type } = req.body;
    const updatedStock = await pool.query(
      "UPDATE stocks SET location_id = $1, employee_id = $2, stock_name = $3, stock_full_name = $4, stock_type = $5 WHERE stock_id = $6 RETURNING *",
      [location_id, employee_id, stock_name, stock_full_name, stock_type, id]
    );
    if (updatedStock.rows.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }
    res.json(updatedStock.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a stock by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStock = await pool.query("DELETE FROM stocks WHERE stock_id = $1 RETURNING *", [id]);
    if (deletedStock.rows.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }
    res.json({ message: "Stock deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
