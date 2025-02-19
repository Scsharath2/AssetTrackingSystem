const pool = require("../db");
const fetch = require("node-fetch");

const fetchServiceNowData = async (tableName) => {
  try {
    // ✅ Get the base ServiceNow URL from the database
    const configRes = await pool.query("SELECT service_now_url FROM configuration LIMIT 1");
    if (configRes.rows.length === 0) {
      throw new Error("ServiceNow URL is not configured.");
    }

    const baseUrl = configRes.rows[0].service_now_url;
    
    // ✅ Define API endpoints for different tables
    const endpointMap = {
      assets: "/api/now/table/alm_asset",
      stocks: "/api/now/table/alm_stock",
      employees: "/api/now/table/sys_user",
      locations: "/api/now/table/cmn_location",
      models: "/api/now/table/cmdb_model"
    };

    const serviceNowEndpoint = endpointMap[tableName];
    if (!serviceNowEndpoint) throw new Error("Invalid table name");

    // ✅ Fetch Data from ServiceNow
    const response = await fetch(`${baseUrl}${serviceNowEndpoint}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.SERVICENOW_TOKEN}`, // Replace with actual auth method
        "Accept": "application/json",
      }
    });

    const data = await response.json();
    return data.result; // Assuming ServiceNow returns data inside "result"
  } catch (error) {
    console.error("Error fetching data from ServiceNow:", error);
    return null;
  }
};

module.exports = { fetchServiceNowData };
