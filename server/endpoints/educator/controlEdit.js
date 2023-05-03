const pool = require("../../mysql");
const getPermissions = require("../helpers/getRights");

const controlEdit = (req, res) => {
  const { score, id_math, educator_id } = req.query || {};

  if (!educator_id || !score || !id_math) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  const intScore = +score;

  if (intScore > 100 || intScore < 0) {
    return res.status(400).send(new Error("Wrong score"));
  }

  getPermissions("can_edit", educator_id)
    .then((canView) => {
      if (!canView) {
        return res.status(403).send({ message: "Invalid permissions" });
      }

      pool.getConnection(function (err, connection) {
        const sql = `UPDATE math_score SET score = ${score} WHERE ID_math_score = ${id_math};`;

        connection.query(sql, function (error, result) {
          if (error) {
            return res.status(500).send(error);
          }

          const { changedRows } = result;

          if (Boolean(changedRows)) {
            return res.status(200).send({ success: true });
          }

          return res.status(500).send({ message: "Something was bad" });
        });

        pool.releaseConnection(connection);
      });
    })
    .catch((err) => {
      return res.status(403).send({ message: err });
    });
};

module.exports = controlEdit;
