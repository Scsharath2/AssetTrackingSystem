const pool = require("../db");
const axios = require("axios");

// Function to fetch ServiceNow URL from database
const getServiceNowUrl = async () => {
    try {
        const result = await pool.query("SELECT config_value FROM configurations WHERE config_key = 'servicenow_url'");
        return result.rows.length > 0 ? result.rows[0].config_value : null;
    } catch (error) {
        console.error("Error fetching ServiceNow URL:", error.message);
        return null;
    }
};

// Function to manually run a sync
const runSyncNow = async (schedule) => {
    try {
        // Fetch ServiceNow URL dynamically
        const serviceNowBaseUrl = await getServiceNowUrl();
        if (!serviceNowBaseUrl) {
            throw new Error("ServiceNow URL not found in database.");
        }

        // Construct full ServiceNow API endpoint
        const serviceNowUrl = `${serviceNowBaseUrl}${schedule.service_now_table}`;

        const response = await axios.get(serviceNowUrl, {
            headers: {
                Authorization: `Bearer ${process.env.SERVICENOW_API_KEY}`, // API key stored in environment variables
            },
        });

        const data = response.data.result;

        // Insert data into the mapped database table
        for (let record of data) {
            await pool.query(`INSERT INTO ${schedule.database_table} DEFAULT VALUES RETURNING *`);
        }

        // Log success
        await pool.query(
            "INSERT INTO sync_logs (schedule_id, sync_status, started_at, finished_at) VALUES ($1, 'success', NOW(), NOW())",
            [schedule.schedule_id]
        );

        console.log(`Sync completed for ${schedule.database_table}`);
    } catch (error) {
        console.error("Sync failed:", error.message);

        // Log failure
        await pool.query(
            "INSERT INTO sync_logs (schedule_id, sync_status, error_message, started_at, finished_at) VALUES ($1, 'failed', $2, NOW(), NOW())",
            [schedule.schedule_id, error.message]
        );
    }
};

module.exports = { runSyncNow };
