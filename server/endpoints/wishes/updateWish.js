const pool = require("../../mysql");

const updateWish = (req, res) => {
  const { id, text, name } = req.body || {};

  if (!id || !text) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `UPDATE wish SET texts = '${text}', name='${name}' WHERE Id = ${id};`;

    connection.query(sql, function (error, result) {
      if (error) {
        return res.status(500).send(error);
      }

      const { changedRows } = result;

      pool.releaseConnection(connection);

      if (Boolean(changedRows)) {
        return res.status(200).send({ success: true });
      }

      return res.status(500).send({ message: "Something was bad" });
    });
  });
};

module.exports = updateWish;
