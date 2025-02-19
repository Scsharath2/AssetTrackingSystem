const express = require("express");
const router = express.Router();
const pool = require("../db");
const { scheduleSyncJob, runSyncNow } = require("../services/syncService");

// Create a new sync schedule
router.post("/", async (req, res) => {
    try {
        const { service_now_table, database_table, sync_frequency, is_active } = req.body;
        const newSchedule = await pool.query(
            "INSERT INTO sync_schedules (service_now_table, database_table, sync_frequency, is_active, next_run) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
            [service_now_table, database_table, sync_frequency, is_active]
        );
        scheduleSyncJob(newSchedule.rows[0]); // Schedule the job
        res.json(newSchedule.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all sync schedules
router.get("/", async (req, res) => {
    try {
        const schedules = await pool.query("SELECT * FROM sync_schedules");
        res.json(schedules.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a sync schedule
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { service_now_table, database_table, sync_frequency, is_active } = req.body;
        const updatedSchedule = await pool.query(
            "UPDATE sync_schedules SET service_now_table = $1, database_table = $2, sync_frequency = $3, is_active = $4 WHERE schedule_id = $5 RETURNING *",
            [service_now_table, database_table, sync_frequency, is_active, id]
        );
        if (updatedSchedule.rows.length === 0) {
            return res.status(404).json({ error: "Schedule not found" });
        }
        scheduleSyncJob(updatedSchedule.rows[0]); // Re-schedule the job
        res.json(updatedSchedule.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a sync schedule
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM sync_schedules WHERE schedule_id = $1", [id]);
        res.json({ message: "Schedule deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Manually trigger a sync
router.post("/:id/sync", async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await pool.query("SELECT * FROM sync_schedules WHERE schedule_id = $1", [id]);

        if (schedule.rows.length === 0) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        await runSyncNow(schedule.rows[0]); // Manually run the sync job
        res.json({ message: "Sync job triggered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
