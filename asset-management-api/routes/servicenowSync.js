const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");
const { decrypt } = require("../utils/encryption");

// Fetch configuration details from DB
const getServiceNowConfig = async () => {
    const result = await pool.query("SELECT service_now_url, username, encrypted_password FROM configuration LIMIT 1");
    if (result.rows.length === 0) throw new Error("ServiceNow configuration not found.");
    const { service_now_url, username, encrypted_password } = result.rows[0];
    return {
        serviceNowUrl: service_now_url,
        username,
        password: decrypt(encrypted_password),
    };
};

// Generic function to sync data from ServiceNow
const syncServiceNowData = async (tableName, serviceNowTable) => {
    try {
        const { serviceNowUrl, username, password } = await getServiceNowConfig();
        const response = await axios.get(`${serviceNowUrl}/api/now/table/${serviceNowTable}`, {
            auth: { username, password },
            params: { sysparm_limit: 1000 }, // Adjust limit as needed
        });

        const serviceNowData = response.data.result;
        if (!serviceNowData.length) return { message: `No data found in ServiceNow for ${serviceNowTable}` };

        // Insert/update the data into our DB
        for (const record of serviceNowData) {
            await pool.query(
                `INSERT INTO ${tableName} (id, name, updated_at) 
                 VALUES ($1, $2, NOW()) 
                 ON CONFLICT (id) DO UPDATE SET name = $2, updated_at = NOW()`,
                [record.sys_id, record.name]
            );
        }

        return { message: `Successfully synced ${serviceNowData.length} records from ServiceNow (${serviceNowTable})` };
    } catch (error) {
        console.error(`Error syncing ${serviceNowTable}:`, error);
        throw new Error("ServiceNow Sync Failed");
    }
};

// Routes for syncing different tables
router.post("/sync/assets", async (req, res) => {
    try {
        const result = await syncServiceNowData("assets", "alm_asset");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/sync/employees", async (req, res) => {
    try {
        const result = await syncServiceNowData("employees", "sys_user");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/sync/locations", async (req, res) => {
    try {
        const result = await syncServiceNowData("locations", "cmn_location");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/sync/models", async (req, res) => {
    try {
        const result = await syncServiceNowData("models", "cmdb_model");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/sync/stocks", async (req, res) => {
    try {
        const result = await syncServiceNowData("stocks", "alm_stockroom");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
