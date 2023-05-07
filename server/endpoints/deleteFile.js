const pool = require("../mysql");

const deleteFile = (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `DELETE FROM links WHERE id = ${id};`;

    connection.query(sql, function (error, result) {
      if (error) {
        return res.status(500).send(error);
      }

      const { affectedRows } = result;

      pool.releaseConnection(connection);

      if (!Boolean(affectedRows)) {
        return res.status(500).send({ message: "Something was wrong" });
      }

      return res.status(200).send({
        status: true,
        message: "File is deleted",
      });
    });
  });
};

module.exports = deleteFile;
