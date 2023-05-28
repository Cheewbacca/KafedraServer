const pool = require("../mysql");

const register = (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `insert into auth(user_login, user_password) values('${login}', '${password}');`;

    connection.query(sql, function (error, result) {
      if (error) {
        return res.status(500).send(error);
      }

      const { affectedRows } = result;

      pool.releaseConnection(connection);

      if (Boolean(affectedRows)) {
        return res.status(200).send({ success: true });
      }

      return res.status(500).send({ data });
    });
  });
};

module.exports = register;
