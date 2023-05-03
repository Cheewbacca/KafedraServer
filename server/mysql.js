const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "79.132.138.89",
  user: "makas2705",
  password: "makas228322",
  database: "diplom",
});

module.exports = pool;
