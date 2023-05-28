const pool = require("../mysql");

const login = (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `SELECT ID_auth AS id FROM auth WHERE user_login = "${login}" AND user_password = "${password}"`;

    connection.query(sql, function (error, results) {
      if (error) {
        return res.status(500).send(error);
      }

      const [data] = results;

      if (!data) {
        return res.status(403).send({ message: "Invalid data" });
      }

      return res.status(200).send({ data });
    });
  });
};

module.exports = login;
