const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1927",
  database: "diplom",
});

module.exports = pool;
