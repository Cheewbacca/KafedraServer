const pool = require("../../mysql");

const addMind = (req, res) => {
  const { id, text, date } = req.body || {};

  if (!id || !text || !date) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `insert into idea(date, texts, id_user) values('${date}', '${text}', ${id});`;

    connection.query(sql, function (error, result) {
      if (error) {
        return res.status(500).send(error);
      }

      const { affectedRows } = result;

      pool.releaseConnection(connection);

      if (Boolean(affectedRows)) {
        return res.status(200).send({ success: true });
      }

      return res.status(500).send({ message: "Something was bad" });
    });
  });
};

module.exports = addMind;
