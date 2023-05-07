const pool = require("../mysql");

const getAllFiles = (req, res) => {
  pool.getConnection(function (err, connection) {
    const sql = `select * from links;`;

    connection.query(sql, function (error, results) {
      if (error) {
        return res.status(500).send(error);
      }

      const data = results;

      pool.releaseConnection(connection);

      if (!data) {
        return res.status(403).send({ message: "Invalid data" });
      }

      return res.status(200).send({ data });
    });
  });
};

module.exports = getAllFiles;
