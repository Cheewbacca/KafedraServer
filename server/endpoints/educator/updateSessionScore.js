const pool = require("../../mysql");
const getPermissions = require("../helpers/getRights");

const updateSessionScore = (req, res) => {
  const { score, student_id, educator_id } = req.query || {};

  if (!educator_id || !score || !student_id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  const intScore = +score;

  if (intScore > 100 || intScore < 0) {
    return res.status(400).send(new Error("Wrong score"));
  }

  getPermissions("can_edit", educator_id, "exams")
    .then((canView) => {
      if (!canView) {
        return res.status(403).send({ message: "Invalid permissions" });
      }

      pool.getConnection(function (err, connection) {
        const sql = `UPDATE exams SET score = ${score} WHERE ID_student_exam = ${student_id};`;

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

module.exports = updateSessionScore;
