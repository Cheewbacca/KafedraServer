const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "79.132.138.89",
  user: "max",
  password: "makas228",
  database: "mag",
});

module.exports = pool;
