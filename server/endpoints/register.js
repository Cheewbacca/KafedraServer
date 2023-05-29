const pool = require("../mysql");

const makeRegister = (login, password) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      const sql = `insert into auth(user_login, user_password) values('${login}', '${password}');`;

      connection.query(sql, function (error, result) {
        if (error) {
          return reject(error);
        }

        const { affectedRows } = result;

        if (Boolean(affectedRows)) {
          return resolve(true);
        }

        return reject(error);
      });
    });
  });
};

const register = (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  makeRegister(login, password)
    .then(() => {
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
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = register;
