const express = require("express");
const router = express.Router();
const pool = require("../db");
const { encrypt, decrypt } = require("../utils/encryption");
const axios = require("axios");

// Fetch ServiceNow configuration
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT service_now_url, username, encrypted_password FROM configuration LIMIT 1");
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Configuration not found" });
        }
        const { service_now_url, username, encrypted_password } = result.rows[0];
        const decryptedPassword = encrypted_password ? decrypt(encrypted_password) : "";

        res.json({ serviceNowUrl: service_now_url, username, password: decryptedPassword });
    } catch (error) {
        console.error("Error fetching configuration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update ServiceNow configuration
router.post("/", async (req, res) => {
    try {
        const { serviceNowUrl, username, password } = req.body;
        const encryptedPassword = encrypt(password);

        await pool.query(
            "INSERT INTO configuration (service_now_url, username, encrypted_password) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET service_now_url = $1, username = $2, encrypted_password = $3",
            [serviceNowUrl, username, encryptedPassword]
        );

        res.json({ message: "Configuration updated successfully!" });
    } catch (error) {
        console.error("Error updating configuration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Test ServiceNow connection
router.post("/test-connection", async (req, res) => {
    try {
        const { serviceNowUrl, username, password } = req.body;

        const response = await axios.get(`${serviceNowUrl}/api/now/table/incident`, {
            auth: { username, password }
        });

        if (response.status === 200) {
            res.json({ success: true, message: "Connected successfully!" });
        } else {
            res.status(400).json({ success: false, message: "Failed to connect" });
        }
    } catch (error) {
        console.error("ServiceNow connection error:", error);
        res.status(500).json({ success: false, message: "Error connecting to ServiceNow" });
    }
});

module.exports = router;
