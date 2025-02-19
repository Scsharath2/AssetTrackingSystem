require("dotenv").config();
const { Pool } = require("pg");

// Create a database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
