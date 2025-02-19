const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create a new employee
router.post("/", async (req, res) => {
  try {
    const { id_no, first_name, last_name, location_id, email_address, user_name, manager } = req.body;
    const newEmployee = await pool.query(
      "INSERT INTO employees (id_no, first_name, last_name, location_id, email_address, user_name, manager) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [id_no, first_name, last_name, location_id, email_address, user_name, manager]
    );
    res.json(newEmployee.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read all employees with count
router.get("/", async (req, res) => {
  try {
    const allEmployees = await pool.query("SELECT * FROM employees");
    const count = await pool.query("SELECT COUNT(*) FROM employees");
    res.json({ count: count.rows[0].count, data: allEmployees.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read a single employee by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await pool.query("SELECT * FROM employees WHERE employee_id = $1", [id]);
    if (employee.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update an employee by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_no, first_name, last_name, location_id, email_address, user_name, manager } = req.body;
    const updatedEmployee = await pool.query(
      "UPDATE employees SET id_no = $1, first_name = $2, last_name = $3, location_id = $4, email_address = $5, user_name = $6, manager = $7 WHERE employee_id = $8 RETURNING *",
      [id_no, first_name, last_name, location_id, email_address, user_name, manager, id]
    );
    if (updatedEmployee.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(updatedEmployee.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an employee by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await pool.query("DELETE FROM employees WHERE employee_id = $1 RETURNING *", [id]);
    if (deletedEmployee.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
