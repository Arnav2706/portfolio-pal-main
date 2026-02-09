const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Arnav@123",
  database: "stock_portfolio_db",
});

module.exports = pool.promise();