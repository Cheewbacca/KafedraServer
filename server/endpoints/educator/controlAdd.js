const pool = require("../../mysql");
const getPermissions = require("../helpers/getRights");

const controlAdd = (req, res) => {
  const {
    student_id,
    score_date,
    score,
    type_of_control,
    educator_id,
    subject_id,
    resource,
  } = req.body || {};

  if (
    !student_id ||
    !score_date ||
    !score ||
    !type_of_control ||
    !educator_id ||
    !subject_id ||
    !resource
  ) {
    return res.status(403).send({ message: "Some field is missing" });
  }

  const intScore = +score;

  if (intScore > 100 || intScore < 0) {
    return res.status(400).send(new Error("Wrong score"));
  }

  getPermissions("can_add", educator_id, resource)
    .then((canView) => {
      if (!canView) {
        return res.status(403).send({ message: "Invalid permissions" });
      }

      pool.getConnection(function (err, connection) {
        const sql = `INSERT INTO ${resource} (student_id, score_date, score, type_of_control, educator_id, subject_id) VALUES (${student_id}, "${score_date}", ${score}, "${type_of_control}", ${educator_id}, ${subject_id});`;

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
    })
    .catch((err) => {
      return res.status(403).send({ message: err });
    });
};

module.exports = controlAdd;
