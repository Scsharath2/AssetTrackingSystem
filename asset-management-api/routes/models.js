const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ Create a new model (Already implemented)
router.post("/", async (req, res) => {
  try {
    const { model_full_name, model_nature, model_cost, material_number, model_level_1, model_level_2, model_level_3, model_category } = req.body;
    const newModel = await pool.query(
      "INSERT INTO models (model_full_name, model_nature, model_cost, material_number, model_level_1, model_level_2, model_level_3, model_category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [model_full_name, model_nature, model_cost, material_number, model_level_1, model_level_2, model_level_3, model_category]
    );
    res.json(newModel.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Read all models with count (for pagination)
router.get("/", async (req, res) => {
  try {
    const allModels = await pool.query("SELECT * FROM models");
    const count = await pool.query("SELECT COUNT(*) FROM models");
    res.json({ count: count.rows[0].count, data: allModels.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Read a single model by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const model = await pool.query("SELECT * FROM models WHERE model_id = $1", [id]);
    if (model.rows.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }
    res.json(model.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update a model by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { model_full_name, model_nature, model_cost, material_number, model_level_1, model_level_2, model_level_3, model_category } = req.body;

    const updatedModel = await pool.query(
      "UPDATE models SET model_full_name = $1, model_nature = $2, model_cost = $3, material_number = $4, model_level_1 = $5, model_level_2 = $6, model_level_3 = $7, model_category = $8 WHERE model_id = $9 RETURNING *",
      [model_full_name, model_nature, model_cost, material_number, model_level_1, model_level_2, model_level_3, model_category, id]
    );

    if (updatedModel.rows.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json(updatedModel.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Delete a model by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedModel = await pool.query("DELETE FROM models WHERE model_id = $1 RETURNING *", [id]);

    if (deletedModel.rows.length === 0) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json({ message: "Model deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
